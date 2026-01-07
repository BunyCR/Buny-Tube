const app = {
    MASTER_KEY: 'AIzaSyAJmuNSyU1AOn0z_jKZIpJNz-nUAZkt388',
    viewStats: JSON.parse(localStorage.getItem('b_stats')) || {},
    favs: JSON.parse(localStorage.getItem('b_favs')) || [],
    currentVid: null,

    init() {
        this.renderCats();
        this.fetchVideos("trend videolar");
    },

    renderCats() {
        const cats = ["Gündem", "Müzik", "Oyun", "Teknoloji", "Haber"];
        document.getElementById('category-bar').innerHTML = cats.map(c => `<button onclick="app.fetchVideos('${c}')">${c}</button>`).join('');
    },

    async fetchVideos(q) {
        const res = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=16&q=${encodeURIComponent(q)}&type=video&key=${this.MASTER_KEY}`);
        const data = await res.json();
        document.getElementById('main-feed').innerHTML = data.items.map(v => `
            <div class="v-card" onclick="app.play('${v.id.videoId}', '${v.snippet.title.replace(/'/g,"")}')">
                <img src="${v.snippet.thumbnails.high.url}">
                <div class="v-info">
                    <p>${v.snippet.title}</p>
                    <small style="color:gray"><i class="fas fa-eye"></i> ${this.viewStats[v.id.videoId] || 0}</small>
                </div>
            </div>
        `).join('');
    },

    play(id, title) {
        this.currentVid = {id, title};
        this.viewStats[id] = (this.viewStats[id] || 0) + 1;
        localStorage.setItem('b_stats', JSON.stringify(this.viewStats));
        
        document.getElementById('player').style.display = 'block';
        document.getElementById('playing-title').innerText = title;
        document.getElementById('video-view-count').innerHTML = `<i class="fas fa-eye"></i> ${this.viewStats[id]} İzlenme`;
        document.getElementById('player-box').innerHTML = `<iframe src="https://www.youtube.com/embed/${id}?autoplay=1" style="width:100%; height:100%; border:none;" allowfullscreen></iframe>`;
        
        this.fetchSuggestions(title);
    },

    async fetchSuggestions(title) {
        const res = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=6&q=${encodeURIComponent(title)}&type=video&key=${this.MASTER_KEY}`);
        const data = await res.json();
        document.getElementById('suggestion-list').innerHTML = `<h4 style="margin-bottom:10px">SIRADAKİLER</h4>` + 
            data.items.map(v => `
                <div class="suggest-item" onclick="app.play('${v.id.videoId}', '${v.snippet.title.replace(/'/g,"")}')">
                    <img src="${v.snippet.thumbnails.medium.url}">
                    <p style="font-size:0.8rem">${v.snippet.title}</p>
                </div>
            `).join('');
    },

    blockShorts() { document.getElementById('access-denied-screen').style.display = 'flex'; },
    unlockSystem() { document.getElementById('access-denied-screen').style.display = 'none'; this.fetchVideos("trendler"); },
    closePlayer() { document.getElementById('player').style.display = 'none'; document.getElementById('player-box').innerHTML = ''; },
    openLogin() { document.getElementById('login-modal').style.display = 'flex'; },
    closeLogin() { document.getElementById('login-modal').style.display = 'none'; },
    checkLogin() { if(document.getElementById('admin-pass-input').value === "1234") { alert("ADMİN ONAYLANDI"); this.closeLogin(); } else { alert("HATALI"); } },

    startVoiceSearch() {
        const rec = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        rec.lang = 'tr-TR';
        rec.onresult = (e) => this.fetchVideos(e.results[0][0].transcript);
        rec.start();
    }
};
window.onload = () => app.init();
