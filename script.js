const app = {
    apiKey: 'AIzaSyCr91qNZO-jHaJil5uWLN4W6oO2LbtTWeE',
    
    init() {
        this.fetchData('yeni çıkan teknolojik ürünler 2026');
        this.bindEvents();
    },

    bindEvents() {
        document.getElementById('search-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.fetchData(e.target.value);
        });
    },

    async fetchData(query) {
        const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=20&q=${encodeURIComponent(query)}&type=video&key=${this.apiKey}`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            this.renderVideos(data.items);
        } catch (error) {
            console.error('API Hatası:', error);
        }
    },

    renderVideos(videos) {
        const container = document.getElementById('video-container');
        container.innerHTML = videos.map(v => `
            <div class="video-item" onclick="app.playVideo('${v.id.videoId}', '${v.snippet.title.replace(/'/g, "")}')">
                <div class="thumb-container">
                    <img src="${v.snippet.thumbnails.high.url}">
                </div>
                <div style="padding: 10px 0;">
                    <h3 style="font-size: 14px; margin-bottom: 5px;">${v.snippet.title}</h3>
                    <p style="font-size: 12px; color: #aaa;">${v.snippet.channelTitle}</p>
                </div>
            </div>
        `).join('');
    },

    playVideo(id, title) {
        const overlay = document.getElementById('video-overlay');
        overlay.style.display = 'flex';
        document.getElementById('player-box').innerHTML = `
            <iframe src="https://www.youtube.com/embed/${id}?autoplay=1" 
                    style="width:100%; height:100%; border:none;" 
                    allow="autoplay; fullscreen"></iframe>
        `;
    },

    closeVideo() {
        document.getElementById('video-overlay').style.display = 'none';
        document.getElementById('player-box').innerHTML = ''; // Sesi kesmek için önemli
    }
};

window.onload = () => app.init();
