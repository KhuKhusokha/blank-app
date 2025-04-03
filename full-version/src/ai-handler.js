const CACHE_PREFIX = 'seo-ai-cache_';
const CACHE_EXPIRY_MS = 60 * 60 * 1000; // 1 hour cache

export class AIProcessor {
    constructor() {
        // IMPORTANT: Replace with your actual Hugging Face API key
        // Consider using environment variables in a real deployment
        this.HF_API_KEY = 'YOUR_HUGGINGFACE_API_KEY_HERE'; // <--- REPLACE THIS
        this.OLLAMA_MODEL = 'gemma:latest'; // Updated based on project desc; use 3.1b if needed
        this.OLLAMA_ENDPOINT = 'http://localhost:11434/api/generate'; // Default Ollama API endpoint
        this.PROXY_ENDPOINT = '/api/ollama/generate'; // Use this if using the local proxy for CORS
        this.USE_PROXY = true; // Set to true if running the local proxy.js
    }

    _getCacheKey(endpoint, data) {
        // Create a simple cache key (can be improved for complex data)
        const dataString = typeof data === 'string' ? data : JSON.stringify(data);
        return `${CACHE_PREFIX}${endpoint}_${dataString}`;
    }

    _getFromCache(key) {
        const cached = localStorage.getItem(key);
        if (!cached) return null;

        const { timestamp, data } = JSON.parse(cached);
        if (Date.now() - timestamp > CACHE_EXPIRY_MS) {
            localStorage.removeItem(key); // Cache expired
            return null;
        }
        console.log("AI Response // Retrieved from Local Cache");
        return data;
    }

    _saveToCache(key, data) {
        const cacheItem = {
            timestamp: Date.now(),
            data: data
        };
        try {
            localStorage.setItem(key, JSON.stringify(cacheItem));
        } catch (e) {
            console.error("Failed to save to cache:", e);
            // Handle potential storage quota errors
        }
    }

    async generateContent(hfModelEndpoint, ollamaPromptData, cacheDataKey) {
        const cacheKey = this._getCacheKey(hfModelEndpoint, cacheDataKey || ollamaPromptData);
        const cachedResponse = this._getFromCache(cacheKey);
        if (cachedResponse) {
            return { success: true, source: 'cache', data: cachedResponse };
        }

        let result = { success: false, source: 'error', error: 'All AI services failed', data: null };

        // 1. Attempt Hugging Face
        console.log(`AI Request // Attempting Hugging Face: ${hfModelEndpoint}`);
        try {
            const hfResponse = await this._callHuggingFace(hfModelEndpoint, ollamaPromptData); // Use same data struct for now
            if (hfResponse.success) {
                console.log("AI Response // Success from Hugging Face");
                result = { success: true, source: 'huggingface', data: hfResponse.data };
                this._saveToCache(cacheKey, result.data);
                return result;
            }
            console.warn(`AI Fallback // Hugging Face failed: ${hfResponse.error}. Trying Ollama.`);
        } catch (error) {
            console.error(`AI Fallback // Error calling Hugging Face: ${error.message}. Trying Ollama.`);
        }

        // 2. Fallback to Ollama
        console.log(`AI Request // Attempting Ollama: ${this.OLLAMA_MODEL}`);
        try {
            // Construct a suitable prompt string for Ollama if ollamaPromptData isn't already one
             const prompt = typeof ollamaPromptData === 'object' && ollamaPromptData.inputs
                ? `Based on the input "${ollamaPromptData.inputs}", please generate the required content.`
                : ollamaPromptData.prompt || JSON.stringify(ollamaPromptData); // Adjust prompt as needed

            const ollamaResponse = await this._callOllama(this.OLLAMA_MODEL, { prompt: prompt }); // Ollama expects a 'prompt' field
             if (ollamaResponse.success) {
                console.log("AI Response // Success from Ollama");
                result = { success: true, source: 'ollama', data: ollamaResponse.data };
                this._saveToCache(cacheKey, result.data);
                return result;
            }
             console.warn(`AI Fallback // Ollama failed: ${ollamaResponse.error}. Checking cache again (might have been populated during request).`);
             result.error = `Hugging Face failed. Ollama failed: ${ollamaResponse.error}`; // Update error message
        } catch (error) {
            console.error(`AI Fallback // Error calling Ollama: ${error.message}. Checking cache.`);
            result.error = `Hugging Face failed. Ollama Error: ${error.message}`; // Update error message
        }

        // 3. Final Cache Check (redundant with check at start, but safe) & Error
        const finalCached = this._getFromCache(cacheKey);
        if (finalCached) {
             console.warn("AI Response // Found in cache after failures.");
             return { success: true, source: 'cache-after-fail', data: finalCached };
        }

        console.error("AI Service Error // All sources (HF, Ollama, Cache) failed.");
        return result; // Return the final error state
    }

    async _callHuggingFace(model, inputs) {
        if (!this.HF_API_KEY || this.HF_API_KEY === 'YOUR_HUGGINGFACE_API_KEY_HERE') {
            return { success: false, error: 'Hugging Face API Key not configured.' };
        }
        const url = `https://api-inference.huggingface.co/models/${model}`;
        const payload = typeof inputs === 'object' ? inputs : { inputs: inputs }; // Ensure correct payload format

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.HF_API_KEY}`,
                    'Content-Type': 'application/json' // Important header
                },
                body: JSON.stringify(payload),
            });

            const responseData = await response.json();

            if (!response.ok) {
                // Handle specific HF errors (like model loading)
                const errorMsg = responseData.error || `HTTP Error ${response.status}`;
                if (responseData.error && responseData.error.includes("currently loading")) {
                     console.warn(`HuggingFace Model Loading: ${model}. Waiting might help.`);
                     return { success: false, error: `Model ${model} is loading (${response.status})` };
                 }
                return { success: false, error: errorMsg };
            }

            // Handle different response structures (some return array, some object)
            let generatedText = '';
            if (Array.isArray(responseData) && responseData[0]?.generated_text) {
                generatedText = responseData[0].generated_text;
            } else if (responseData.generated_text) {
                 generatedText = responseData.generated_text;
             } else {
                // Fallback or specific handling for other formats if needed
                 generatedText = JSON.stringify(responseData); // Return raw JSON if format unknown
                 console.warn("Uncommon HuggingFace response format:", responseData);
             }

            return { success: true, data: generatedText };

        } catch (error) {
            console.error("Network or Fetch Error (Hugging Face):", error);
            return { success: false, error: `Network Error: ${error.message}` };
        }
    }

     async _callOllama(model, data) {
         const endpoint = this.USE_PROXY ? this.PROXY_ENDPOINT : this.OLLAMA_ENDPOINT;
         console.log(`Calling Ollama via: ${endpoint}`);
        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: model,
                    prompt: data.prompt, // Ensure 'prompt' is passed
                    stream: false
                })
            });

            const responseData = await response.json();

            if (!response.ok || responseData.error) {
                 const errorMsg = responseData.error || `Ollama HTTP Error ${response.status}`;
                 console.error("Ollama API Error:", errorMsg);
                return { success: false, error: errorMsg };
            }

            // Ollama typically returns response in 'response' field when stream=false
            if (!responseData.response) {
                console.error("Ollama response missing 'response' field:", responseData);
                return { success: false, error: "Ollama returned unexpected data structure." };
            }

            return { success: true, data: responseData.response };

        } catch (error) {
            // Handle network errors, or if the Ollama server/proxy isn't running
            console.error(`Network or Fetch Error (Ollama via ${endpoint}):`, error);
            let userFriendlyError = `Failed to connect to local Ollama service (${error.message}).`;
            if (this.USE_PROXY) {
                userFriendlyError += " Ensure the proxy server is running.";
            } else {
                 userFriendlyError += " Ensure Ollama is running and accessible. CORS issues might require a proxy.";
             }
            return { success: false, error: userFriendlyError };
        }
    }
}
