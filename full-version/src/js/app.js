import { initParticleBackground } from './three-config.js';
import { AIProcessor } from './ai-handler.js';

// --- DOM Elements ---
const keywordInput = document.getElementById('keyword-input');
const keywordOutput = document.getElementById('keyword-output');
const expandKeywordsBtn = document.getElementById('expand-keywords-btn');

const articleTopicInput = document.getElementById('article-topic-input');
const articleOutput = document.getElementById('article-output');
const generateArticleBtn = document.getElementById('generate-article-btn');

const urlInput = document.getElementById('url-input');
const seoOutput = document.getElementById('seo-output');
const analyzeSeoBtn = document.getElementById('analyze-seo-btn');

const statusIndicator = document.getElementById('status-indicator');
const statusText = document.getElementById('status-text');

// --- Initialize Modules ---
initParticleBackground(); // Start the background animation
const aiProcessor = new AIProcessor();

// --- Voice Synthesis ---
const synth = window.speechSynthesis;
let voice = null;
function loadVoices() {
    // Attempt to get a more interesting voice if available
    const voices = synth.getVoices();
    voice = voices.find(v => v.lang.includes('en') && (v.name.includes('Google') || v.name.includes('Neural'))) || voices[0];
}
// Voices load asynchronously
if (synth.onvoiceschanged !== undefined) {
    synth.onvoiceschanged = loadVoices;
}
loadVoices(); // Initial attempt

function speak(text) {
    if (synth.speaking) {
        console.log('SpeechSynthesis.speaking');
        return;
    }
    if (text !== '') {
        const utterThis = new SpeechSynthesisUtterance(text);
        utterThis.onerror = function (event) {
            console.error('SpeechSynthesisUtterance.onerror', event);
        };
        utterThis.voice = voice;
        // Optional: Adjust pitch and rate for cyberpunk effect
        utterThis.pitch = 0.8;
        utterThis.rate = 1.1;
        synth.speak(utterThis);
    }
}


// --- UI Update Functions ---
function setLoadingState(buttonElement, outputArea, cardElement, isLoading, message = "AI Processing...") {
    if (isLoading) {
        speak("AI is thinking...");
        buttonElement.disabled = true;
        outputArea.value = ""; // Clear previous output
        outputArea.classList.remove('error-field');
        cardElement.classList.add('loading');
        statusIndicator.className = 'status-indicator loading show';
        statusText.textContent = `Status: ${message}`;
    } else {
        buttonElement.disabled = false;
        cardElement.classList.remove('loading');
        statusIndicator.classList.remove('loading');
        // Status text/class will be updated by success/error handlers
    }
}

function setResultState(outputArea, cardElement, result) {
    cardElement.classList.remove('loading'); // Ensure loading visuals stop
    statusIndicator.classList.remove('loading');

    if (result.success) {
        outputArea.value = result.data.trim();
        outputArea.classList.remove('error-field');
        cardElement.classList.remove('error');
        statusIndicator.className = 'status-indicator success show';
        statusText.textContent = `Status: Complete (${result.source})`;
        speak("Task complete.");
    } else {
        const errorMessage = `Error: ${result.error}\n\n(Source: ${result.source})`;
        outputArea.value = errorMessage;
        outputArea.classList.add('error-field');
        cardElement.classList.add('error'); // Flash card border red
        statusIndicator.className = 'status-indicator error show';
        statusText.textContent = `Status: Error!`;
        speak("Error encountered.");
        console.error("AI Processing Error:", result);
        // Optionally remove error state after a delay
        setTimeout(() => {
            cardElement.classList.remove('error');
            outputArea.classList.remove('error-field');
        }, 5000);
    }
    // Hide status indicator after a few seconds
     setTimeout(() => {
         statusIndicator.classList.remove('show');
     }, 6000);
}


// --- Event Listeners ---

expandKeywordsBtn.addEventListener('click', async () => {
    const seedKeyword = keywordInput.value.trim();
    if (!seedKeyword) {
        alert("Please enter a seed keyword.");
        return;
    }

    const cardElement = document.getElementById('tool-keyword-expander');
    setLoadingState(expandKeywordsBtn, keywordOutput, cardElement, true, "Expanding keywords...");

    // Define models and prompts
    const hfModel = 'google/flan-t5-xxl'; // Or other suitable text2text generation model
    const promptData = { inputs: `Expand the following SEO keyword into a list of related keywords, long-tail variations, and related questions: "${seedKeyword}"` };
    const cacheKeyData = seedKeyword; // Use just the keyword for caching this tool

    const result = await aiProcessor.generateContent(hfModel, promptData, cacheKeyData);
    setResultState(keywordOutput, cardElement, result);
});

generateArticleBtn.addEventListener('click', async () => {
    const topic = articleTopicInput.value.trim();
    if (!topic) {
        alert("Please enter an article topic.");
        return;
    }

    const cardElement = document.getElementById('tool-article-generator');
    setLoadingState(generateArticleBtn, articleOutput, cardElement, true, "Generating article...");

    // Use Ollama primarily for this task as specified, HF could be a backup but might need different model/prompt
    // We'll use the Ollama prompt format directly
    const ollamaPrompt = `Write a short SEO-friendly article (around 300-500 words) about the following topic: "${topic}". Focus on clarity, key information, and include a relevant title.`;
    const promptData = { prompt: ollamaPrompt }; // Ollama specific format

    // For HF fallback (if desired), you might use a generic text-generation model
    // const hfModel = 'gpt2'; // Example, might need larger model for good articles
    // const hfPromptData = { inputs: ollamaPrompt };
    // For simplicity here, we primarily target Ollama, letting the handler manage fallback if Ollama fails
    const hfModel = 'gpt2'; // Define a fallback HF model endpoint anyway
    const cacheKeyData = topic;


    // NOTE: aiProcessor currently tries HF first. You might adapt ai-handler.js
    // if you want specific tools to *prefer* Ollama. For now, it follows the defined chain.
     const result = await aiProcessor.generateContent(hfModel, promptData, cacheKeyData);

    setResultState(articleOutput, cardElement, result);
});

analyzeSeoBtn.addEventListener('click', async () => {
    const inputData = urlInput.value.trim();
    if (!inputData) {
        alert("Please enter a URL or text to analyze.");
        return;
    }

    const cardElement = document.getElementById('tool-seo-analysis');
    setLoadingState(analyzeSeoBtn, seoOutput, cardElement, true, "Analyzing SEO...");

    // Custom logic might fetch URL content first, then pass to AI
    // For simplicity, we'll just pass the input directly to the AI
    let analysisPrompt;
    if (inputData.startsWith('http://') || inputData.startsWith('https://')) {
        // Basic URL check - a real implementation would fetch content first
        speak("Fetching URL data is not implemented. Analyzing the URL string itself.");
        analysisPrompt = `Perform a basic SEO analysis based *only* on the URL itself: "${inputData}". Suggest potential keywords, target audience, and possible content themes based on the domain and path. Then, provide 3 general on-page SEO tips.`;
    } else {
        // Assume it's text content
        analysisPrompt = `Perform a basic SEO analysis on the following text. Identify potential keywords, suggest a suitable H1 tag, and provide 3 actionable on-page SEO improvement tips based *only* on this text:\n\n"${inputData}"`;
    }

    const promptData = { prompt: analysisPrompt }; // Ollama format
    const hfModel = 'google/flan-t5-xxl'; // Suitable for analysis/suggestion tasks
    const hfPromptData = { inputs: analysisPrompt }; // HF format
    const cacheKeyData = inputData.substring(0, 100); // Cache based on input start

    const result = await aiProcessor.generateContent(hfModel, hfPromptData, cacheKeyData); // Pass HF formatted data first

    setResultState(seoOutput, cardElement, result);
});
