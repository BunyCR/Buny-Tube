const app = {
    settings: {
        apiKey: 'AIzaSyCr91qNZO-jHaJil5uWLN4W6oO2LbtTWeE', // Kendi Key'ini gir kanka
        logoName: 'BUNY-TUBE', adminPass: '1234', themeColor: '#ff0000',
        announcementMsg: '', announcementLink: '', isAnnActive: false,
        categories: ["Gelecek", "Oyun", "Teknoloji", "Müzik"]
    },
    comments: [], favorites: [], viewStats: {},

    init() {
        const saved = localStorage.getItem('master_buny');
        if(saved) this.settings = JSON.parse(saved);
        this.comments = JSON.parse(localStorage.getItem('buny_comments')) || [];
        this.favorites = JSON.parse(localStorage.getItem('buny_favs')) || [];
        this.viewStats = JSON.parse(localStorage.getItem('buny_stats')) || {};

        document.documentElement.style.setProperty('--red', this.settings.themeColor);
        document.getElementById('display-logo').innerText = this.settings.logoName;
        
        if(this.settings.isAnnActive) {
            document.getElementById('announcement-bar').style.display = 'block';
            document.getElementById('ann-content').innerHTML = `${this.settings.announcementMsg} <a href="${this.settings.announcementLink}" style="color:white">İNDİR</a>`;
        }

        this.renderCategories();
        this.fetchVideos("2026 tech");
    },

    renderCategories() {
        const bar = document.getElementById('category-bar');
        bar.innerHTML = this.settings.categories.map(c => `<button onclick="app.fetchVideos('${c}')">${c}</button>`).join('');
    },

    async fetchVideos(q) {
        const res = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=12&q=${encodeURIComponent(q)}&type=video&key=${this.settings.apiKey}`);
        const data = await res.json();
        document.getElementById('main-feed').innerHTML = data.items.map(v => this.vCard(v)).join('');
    },

    vCard(v) {
        const id = v.id.videoId;
        const views = this.viewStats[id] || 0;
        const isFav = this.favorites.some(f => f.id === id);
        return `
            <div class="v-card">
                <img src="${v.snippet.thumbnails.high.url}" onclick="app.play('${id}', '${v.snippet.title.replace(/'/g,"")}')">
                <div style="padding:15px;">
                    <p style="font-size:0.8rem; font-weight:bold;">${v.snippet.title}</p>
                    <div style="display:flex; justify-content:space-between; margin-top:10px; align-items:center;">
                        <span style="font-size:0.7rem; color:gray;"><i class="fas fa-eye"></i> ${views}</span>
                        <i class="fas fa-heart" onclick="app.toggleFav('${id}','${v.snippet.title.replace(/'/g,"")}')" style="color:${isFav?'red':'#333'}"></i>
                    </div>
                </div>
            </div>`;
    },

    play(id, title) {
        this.viewStats[id] = (this.viewStats[id] || 0) + 1;
        localStorage.setItem('buny_stats', JSON.stringify(this.viewStats));
        
        const p = document.getElementById('player');
        p.style.display = 'block';
        p.classList.remove('mini-mode');
        document.getElementById('playing-title').innerText = title;
        document.getElementById('player-box').innerHTML = `<iframe src="https://www.youtube.com/embed/${id}?autoplay=1" style="width:100%; height:100%; border:none;" allowfullscreen></iframe>`;
        this.fetchSuggestions(title);
    },

    async fetchSuggestions(title) {
        const res = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=6&q=${encodeURIComponent(title)}&type=video&key=${this.settings.apiKey}`);
        const data = await res.json();
        document.getElementById('suggestion-list').innerHTML = `<h3 style="padding:15px; font-size:0.9rem;">ÖNERİLENLER</h3>` + 
            data.items.map(v => `<div onclick="app.play('${v.id.videoId}','${v.snippet.title.replace(/'/g,"")}')" style="display:flex; gap:10px; padding:10px;"><img src="${v.snippet.thumbnails.medium.url}" style="width:100px; border-radius:8px;"><p style="font-size:0.7rem;">${v.snippet.title}</p></div>`).join('');
    },

    minimize() { document.getElementById('player').classList.add('mini-mode'); },
    closePlayer() { document.getElementById('player').style.display = 'none'; document.getElementById('player-box').innerHTML = ''; },

    startVoiceSearch() {
        const rec = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        rec.lang = 'tr-TR';
        rec.onresult = (e) => { this.fetchVideos(e.results[0][0].transcript); };
        rec.start();
    },

    openAdmin() {
        const p = prompt("YETKİLİ ŞİFRESİ:");
        if(p === this.settings.adminPass) {
            document.getElementById('admin-panel').style.display = 'block';
            document.getElementById('stat-views').innerText = Object.values(this.viewStats).reduce((a,b)=>a+b, 0);
            document.getElementById('stat-coms').innerText = this.comments.length;
            this.renderAdminComments();
        }
    },

    renderAdminComments() {
        document.getElementById('admin-comments-list').innerHTML = this.comments.map((c,i) => `<div style="padding:10px; border-bottom:1px solid #222;"><small style="color:red">${c.name}</small><p>${c.text}</p></div>`).join('');
    },

    addComment() {
        const name = document.getElementById('com-name').value;
        const text = document.getElementById('com-text').value;
        if(name && text) {
            this.comments.push({name, text});
            localStorage.setItem('buny_comments', JSON.stringify(this.comments));
            alert("Muhammed Ali'ye iletildi!");
            location.reload();
        }
    },

    saveSettings() {
        this.settings.logoName = document.getElementById('edit-logo').value || this.settings.logoName;
        this.settings.apiKey = document.getElementById('edit-key').value || this.settings.apiKey;
        this.settings.adminPass = document.getElementById('edit-pass').value || this.settings.adminPass;
        this.settings.themeColor = document.getElementById('edit-color').value;
        this.settings.announcementMsg = document.getElementById('msg-input').value;
        this.settings.announcementLink = document.getElementById('link-input').value;
        this.settings.isAnnActive = document.getElementById('ann-toggle').checked;
        localStorage.setItem('master_buny', JSON.stringify(this.settings));
        location.reload();
    },

    toggleFav(id, title) {
        const idx = this.favorites.findIndex(f => f.id === id);
        if(idx > -1) this.favorites.splice(idx,1); else this.favorites.push({id, title});
        localStorage.setItem('buny_favs', JSON.stringify(this.favorites));
        location.reload();
    },

    showFavorites() {
        document.getElementById('main-feed').innerHTML = this.favorites.length ? 
            this.favorites.map(f => `<div class="v-card"><div onclick="app.play('${f.id}','${f.title}')" style="padding:20px; background:#111;">❤️ ${f.title}</div></div>`).join('') : "Henüz favori yok kral.";
    }
};

window.onload = () => app.init();
