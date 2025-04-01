<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SEO AI Tools</title>
    <link rel="stylesheet" href="{{ url_for('static', filename='styles.css') }}">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
    <header class="bg-dark text-white p-3">
        <div class="container">
            <h1>SEO AI Tools</h1>
            <p>Powered by Local AI Models</p>
        </div>
    </header>

    <div class="container mt-4">
        <ul class="nav nav-tabs" id="myTab" role="tablist">
            <li class="nav-item" role="presentation">
                <button class="nav-link active" id="keywords-tab" data-bs-toggle="tab" data-bs-target="#keywords" type="button" role="tab">Keywords Finder</button>
            </li>
            <li class="nav-item" role="presentation">
                <button class="nav-link" id="title-meta-tab" data-bs-toggle="tab" data-bs-target="#title-meta" type="button" role="tab">Title & Meta</button>
            </li>
            <li class="nav-item" role="presentation">
                <button class="nav-link" id="article-tab" data-bs-toggle="tab" data-bs-target="#article" type="button" role="tab">Article Generation</button>
            </li>
            <li class="nav-item" role="presentation">
                <button class="nav-link" id="seo-analysis-tab" data-bs-toggle="tab" data-bs-target="#seo-analysis" type="button" role="tab">SEO Analysis</button>
            </li>
            <li class="nav-item" role="presentation">
                <button class="nav-link" id="lounge-tab" data-bs-toggle="tab" data-bs-target="#lounge" type="button" role="tab">AI Lounge</button>
            </li>
        </ul>

        <div class="tab-content mt-3" id="myTabContent">
            <!-- Keywords Finder Tab -->
            <div class="tab-pane fade show active" id="keywords" role="tabpanel" aria-labelledby="keywords-tab">
                <div class="row">
                    <div class="col-md-6">
                        <div class="card">
                            <div class="card-header">
                                <h5>Keywords Finder</h5>
                            </div>
                            <div class="card-body">
                                <div class="mb-3">
                                    <label for="keywordQuery" class="form-label">Enter your main topic</label>
                                    <input type="text" class="form-control" id="keywordQuery" placeholder="e.g., digital marketing">
                                </div>
                                <button type="button" class="btn btn-primary" id="generateKeywords">Generate Keywords</button>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="card">
                            <div class="card-header">
                                <h5>Results</h5>
                            </div>
                            <div class="card-body">
                                <div id="keywordsResult" class="result-area"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Title & Meta Tab -->
            <div class="tab-pane fade" id="title-meta" role="tabpanel" aria-labelledby="title-meta-tab">
                <div class="row">
                    <div class="col-md-6">
                        <div class="card">
                            <div class="card-header">
                                <h5>Title & Meta Description Generator</h5>
                            </div>
                            <div class="card-body">
                                <div class="mb-3">
                                    <label for="titleKeyword" class="form-label">Primary Keyword</label>
                                    <input type="text" class="form-control" id="titleKeyword" placeholder="e.g., SEO tools">
                                </div>
                                <div class="mb-3">
                                    <label for="targetAudience" class="form-label">Target Audience</label>
                                    <input type="text" class="form-control" id="targetAudience" placeholder="e.g., marketing professionals">
                                </div>
                                <button type="button" class="btn btn-primary" id="generateTitleMeta">Generate</button>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="card">
                            <div class="card-header">
                                <h5>Results</h5>
                            </div>
                            <div class="card-body">
                                <div id="titleMetaResult" class="result-area"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Article Generation Tab -->
            <div class="tab-pane fade" id="article" role="tabpanel" aria-labelledby="article-tab">
                <div class="row">
                    <div class="col-md-6">
                        <div class="card">
                            <div class="card-header">
                                <h5>Article Generator</h5>
                            </div>
                            <div class="card-body">
                                <div class="mb-3">
                                    <label for="articleTitle" class="form-label">Article Title</label>
                                    <input type="text" class="form-control" id="articleTitle" placeholder="e.g., The Ultimate Guide to SEO">
                                </div>
                                <div class="mb-3">
                                    <label for="articleKeywords" class="form-label">Keywords (comma separated)</label>
                                    <input type="text" class="form-control" id="articleKeywords" placeholder="e.g., SEO, backlinks, content marketing">
                                </div>
                                <div class="mb-3">
                                    <label for="articleOutline" class="form-label">Outline (optional)</label>
                                    <textarea class="form-control" id="articleOutline" rows="3" placeholder="Brief outline of what you want in the article"></textarea>
                                </div>
                                <div class="mb-3">
                                    <label for="articleTone" class="form-label">Tone</label>
                                    <select class="form-select" id="articleTone">
                                        <option value="informative">Informative</option>
                                        <option value="conversational">Conversational</option>
                                        <option value="professional">Professional</option>
                                        <option value="casual">Casual</option>
                                    </select>
                                </div>
                                <button type="button" class="btn btn-primary" id="generateArticle">Generate Article</button>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="card">
                            <div class="card-header">
                                <h5>Generated Article</h5>
                            </div>
                            <div class="card-body">
                                <div id="articleResult" class="result-area"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- SEO Analysis Tab -->
            <div class="tab-pane fade" id="seo-analysis" role="tabpanel" aria-labelledby="seo-analysis-tab">
                <div class="row">
                    <div class="col-md-6">
                        <div class="card">
                            <div class="card-header">
                                <h5>SEO Analysis Tool</h5>
                            </div>
                            <div class="card-body">
                                <div class="mb-3">
                                    <label for="seoUrl" class="form-label">URL to analyze</label>
                                    <input type="url" class="form-control" id="seoUrl" placeholder="https://example.com">
                                </div>
                                <div class="mb-3">
                                    <label for="seoContent" class="form-label">Or paste content</label>
                                    <textarea class="form-control" id="seoContent" rows="5" placeholder="Paste your content here for analysis"></textarea>
                                </div>
                                <button type="button" class="btn btn-primary" id="analyzeSeo">Analyze</button>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="card">
                            <div class="card-header">
                                <h5>Analysis Results</h5>
                            </div>
                            <div class="card-body">
                                <div id="seoResult" class="result-area"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- AI Lounge Tab -->
            <div class="tab-pane fade" id="lounge" role="tabpanel" aria-labelledby="lounge-tab">
                <div class="row">
                    <div class="col-md-12">
                        <div class="card">
                            <div class="card-header">
                                <h5>AI Lounge - Chat with SEO Expert AI</h5>
                            </div>
                            <div class="card-body">
                                <div id="chatHistory" class="chat-history mb-3"></div>
                                <div class="input-group">
                                    <input type="text" class="form-control" id="chatInput" placeholder="Ask anything about SEO...">
                                    <button class="btn btn-primary" type="button" id="sendChat">Send</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <footer class="bg-dark text-white p-3 mt-5">
        <div class="container text-center">
            <p>© 2025 SEO AI Tools - Powered by wolfgank-AI Models</p>
        </div>
    </footer>

   // Modified callApi function with proper progress
async function callApi(endpoint, data, progressCallback) {
    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        });
        
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let result = '';
        let progress = 0;

        // Progress animation
        const progressInterval = setInterval(() => {
            if(progress < 90) {
                progress += Math.random() * 10;
                progress = Math.min(progress, 90);
                progressCallback(progress);
            }
        }, 300);

        while(true) {
            const {done, value} = await reader.read();
            if(done) {
                clearInterval(progressInterval);
                progressCallback(100);
                break;
            }
            result += decoder.decode(value);
        }
        
        return JSON.parse(result);
        
    } catch(error) {
        console.error('Error:', error);
        return { error: "Gagal terhubung ke layanan AI" };
    }
}

// Example updated function for keywords finder
async function findKeywords() {
    const query = document.getElementById('keywords-query').value;
    if (!query) return alert('Harap masukkan topik');
    
    const resultsDiv = document.getElementById('keywords-results');
    resultsDiv.innerHTML = `
    
        <div class="progress-container">
            <div class="progress-bar"></div>
            <div class="progress-text">0%</div>
        </div>
        <p>Memulai proses pembuatan kata kunci...</p>
    `;

    const progressBar = resultsDiv.querySelector('.progress-bar');
    const progressText = resultsDiv.querySelector('.progress-text');

    const response = await callApi('/api/keywords-finder', { query }, 
        (progress) => {
            progressBar.style.width = `${progress}%`;
            progressText.textContent = `${Math.floor(progress)}%`;
            resultsDiv.querySelector('p').textContent = getProgressMessage(progress);
        }
    );

    if (response.error) {
        resultsDiv.innerHTML = `<p class="error">${response.error}</p>`;
    } else {
        resultsDiv.innerHTML = `
            <h3>Hasil Kata Kunci:</h3>
            <ul>${response.keywords.map(kw => `<li>${kw}</li>`).join('')}</ul>
        `;
    }
}

// Progress messages in Indonesian
function getProgressMessage(progress) {
    if(progress < 25) return "Menganalisis topik...";
    if(progress < 50) return "Mencari pola kata kunci...";
    if(progress < 75) return "Memfilter hasil terbaik...";
    return "Menyusun hasil akhir...";
}
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            // Keywords Finder
            document.getElementById('generateKeywords').addEventListener('click', function() {
                const query = document.getElementById('keywordQuery').value;
                if (!query) return;

                const resultDiv = document.getElementById('keywordsResult');
                resultDiv.innerHTML = '<div class="text-center"><div class="spinner-border" role="status"></div><p>Generating keywords...</p></div>';

                fetch('/api/keywords-finder', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ query: query }),
                })
                .then(response => response.json())
                .then(data => {
                    let html = '<h6>Generated Keywords:</h6><ul>';
                    data.keywords.forEach(keyword => {
                        html += `<li>${keyword}</li>`;
                    });
                    html += '</ul>';
                    resultDiv.innerHTML = html;
                })
                .catch(error => {
                    resultDiv.innerHTML = `<div class="alert alert-danger">Error: ${error.message}</div>`;
                });
            });

            // Title & Meta Generator
            document.getElementById('generateTitleMeta').addEventListener('click', function() {
                const keyword = document.getElementById('titleKeyword').value;
                const audience = document.getElementById('targetAudience').value;
                if (!keyword) return;

                const resultDiv = document.getElementById('titleMetaResult');
                resultDiv.innerHTML = '<div class="text-center"><div class="spinner-border" role="status"></div><p>Generating titles and meta descriptions...</p></div>';

                fetch('/api/title-meta', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        keyword: keyword,
                        target_audience: audience
                    }),
                })
                .then(response => response.json())
                .then(data => {
                    let html = '<h6>Title Options:</h6><ul>';
                    data.titles.forEach(title => {
                        html += `<li>${title}</li>`;
                    });
                    html += '</ul><h6>Meta Description Options:</h6><ul>';
                    data.meta_descriptions.forEach(desc => {
                        html += `<li>${desc}</li>`;
                    });
                    html += '</ul>';
                    resultDiv.innerHTML = html;
                })
                .catch(error => {
                    resultDiv.innerHTML = `<div class="alert alert-danger">Error: ${error.message}</div>`;
                });
            });

            // Article Generator
            document.getElementById('generateArticle').addEventListener('click', function() {
                const title = document.getElementById('articleTitle').value;
                const keywordsRaw = document.getElementById('articleKeywords').value;
                const outline = document.getElementById('articleOutline').value;
                const tone = document.getElementById('articleTone').value;

                if (!title) return;

                const keywords = keywordsRaw.split(',').map(k => k.trim()).filter(k => k);

                const resultDiv = document.getElementById('articleResult');
                resultDiv.innerHTML = '<div class="text-center"><div class="spinner-border" role="status"></div><p>Generating article... This may take a minute.</p></div>';

                fetch('/api/article-generation', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        title: title,
                        keywords: keywords,
                        outline: outline,
                        tone: tone
                    }),
                })
                .then(response => response.json())
                .then(data => {
                    resultDiv.innerHTML = data.article.replace(/\n/g, '<br>');
                })
                .catch(error => {
                    resultDiv.innerHTML = `<div class="alert alert-danger">Error: ${error.message}</div>`;
                });
            });

            // SEO Analysis
            document.getElementById('analyzeSeo').addEventListener('click', function() {
                const url = document.getElementById('seoUrl').value;
                const content = document.getElementById('seoContent').value;

                if (!url && !content) return;

                const resultDiv = document.getElementById('seoResult');
                resultDiv.innerHTML = '<div class="text-center"><div class="spinner-border" role="status"></div><p>Analyzing SEO...</p></div>';

                fetch('/api/seo-analysis', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        url: url,
                        content: content
                    }),
                })
                .then(response => response.json())
                .then(data => {
                    let html = `<h6>SEO Score: ${data.score}/100</h6>`;
                    html += '<h6>Recommendations:</h6><ul>';
                    data.recommendations.forEach(rec => {
                        html += `<li>${rec}</li>`;
                    });
                    html += '</ul>';

                    if (data.keyword_density) {
                        html += '<h6>Keyword Density:</h6><ul>';
                        for (const [keyword, density] of Object.entries(data.keyword_density)) {
                            html += `<li>${keyword}: ${density}%</li>`;
                        }
                        html += '</ul>';
                    }

                    resultDiv.innerHTML = html;
                })
                .catch(error => {
                    resultDiv.innerHTML = `<div class="alert alert-danger">Error: ${error.message}</div>`;
                });
            });

            // AI Lounge Chat
            let chatHistory = [];
            const chatHistoryDiv = document.getElementById('chatHistory');

            function addMessage(sender, message) {
                const messageDiv = document.createElement('div');
                messageDiv.className = sender === 'user' ? 'chat-message user-message' : 'chat-message ai-message';
                messageDiv.innerHTML = `<strong>${sender === 'user' ? 'You' : 'AI'}:</strong> ${message}`;
                chatHistoryDiv.appendChild(messageDiv);
                chatHistoryDiv.scrollTop = chatHistoryDiv.scrollHeight;

                chatHistory.push({
                    role: sender,
                    content: message
                });
            }

            document.getElementById('sendChat').addEventListener('click', function() {
                const message = document.getElementById('chatInput').value;
                if (!message) return;

                addMessage('user', message);
                document.getElementById('chatInput').value = '';

                fetch('/api/ai-lounge', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        message: message,
                        history: chatHistory
                    }),
                })
                .then(response => response.json())
                .then(data => {
                    addMessage('ai', data.response);
                })
                .catch(error => {
                    addMessage('ai', `Error: ${error.message}`);
                });
            });

            document.getElementById('chatInput').addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    document.getElementById('sendChat').click();
                }
            });
        });
    </script>
</body>
</html>
