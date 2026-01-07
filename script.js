const app = {
    // KRAL: API Key'ini sadece buraya yaz, kimse panelden göremez!
    MASTER_KEY: 'AIzaSyCr91qNZO-jHaJil5uWLN4W6oO2LbtTWeE',

    settings: {
        logoName: 'BunyTube', adminPass: '1234', themeColor: '#ff0000',
        announcementMsg: 'SİSTEM AKTİF!', announcementLink: '', isAnnActive: true,
        categories: ["Oyun", "Teknoloji", "Müzik", "Gelecek"]
    },
    
    comments: JSON.parse(localStorage.getItem('buny_comments')) || [],
    viewStats: JSON.parse(localStorage.getItem('buny_stats')) || {},
    favorites: JSON.parse(localStorage.getItem('buny_favs')) || [],

    init() {
        const saved = localStorage.getItem('buny_ultimate_cfg');
        if(saved) this.settings = JSON.parse(saved);
        
        document.documentElement.style.setProperty('--red', this.settings.themeColor);
        document.getElementById('display-logo').innerText = this.settings.logoName;
        
        this.renderAnn();
        this.renderCats();
        this.fetchVideos("2026 tech");
    },

    renderAnn() {
        const bar = document.getElementById('announcement-bar');
        if(this.settings.isAnnActive) {
            bar.style.display = 'block';
            let html = this.settings.announcementMsg;
            if(this.settings.announcementLink) html += ` <a href="${this.settings.announcementLink}" class="ann-btn">İNDİR</a>`;
            document.getElementById('ann-content').innerHTML = html;
        }
    },

    renderCats() {
        document.getElementById('category-bar').innerHTML = this.settings.categories.map(c => `<button onclick="app.fetchVideos('${c}')">${c}</button>`).join('');
    },

    async fetchVideos(q) {
        const res = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=12&q=${encodeURIComponent(q)}&type=video&key=${this.MASTER_KEY}`);
        const data = await res.json();
        document.getElementById('main-feed').innerHTML = data.items.map(v => `
            <div class="v-card">
                <img src="${v.snippet.thumbnails.high.url}" onclick="app.play('${v.id.videoId}', '${v.snippet.title.replace(/'/g,"")}')">
                <div class="v-info">
                    <p>${v.snippet.title}</p>
                    <div class="v-meta">
                        <span><i class="fas fa-eye"></i> ${this.viewStats[v.id.videoId] || 0}</span>
                        <i class="fas fa-heart" onclick="app.toggleFav('${v.id.videoId}', '${v.snippet.title.replace(/'/g,"")}')" style="color:${this.favorites.find(f=>f.id===v.id.videoId)?'red':'#444'}"></i>
                    </div>
                </div>
            </div>
        `).join('');
    },

    play(id, title) {
        this.viewStats[id] = (this.viewStats[id] || 0) + 1;
        localStorage.setItem('buny_stats', JSON.stringify(this.viewStats));
        
        const p = document.getElementById('player');
        p.style.display = 'block';
        p.classList.remove('mini-mode');
        document.getElementById('playing-title').innerText = title;
        document.getElementById('player-box').innerHTML = `<iframe src="https://www.youtube.com/embed/${id}?autoplay=1" style="width:100%; height:100%; border:none;" allowfullscreen></iframe>`;
        this.fetchSuggests(title);
    },

    async fetchSuggests(title) {
        const res = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=6&q=${encodeURIComponent(title)}&type=video&key=${this.MASTER_KEY}`);
        const data = await res.json();
        document.getElementById('suggestion-list').innerHTML = `<h3 style="color:var(--red); margin-bottom:15px;">ÖNERİLENLER</h3>` + 
            data.items.map(v => `<div class="v-card" onclick="app.play('${v.id.videoId}','${v.snippet.title.replace(/'/g,"")}')" style="display:flex; gap:10px; margin-bottom:10px; background:none; border:none;"><img src="${v.snippet.thumbnails.medium.url}" style="width:120px; border-radius:8px;"><p style="font-size:0.8rem;">${v.snippet.title}</p></div>`).join('');
    },

    minimize() { document.getElementById('player').classList.add('mini-mode'); },
    closePlayer() { document.getElementById('player').style.display = 'none'; document.getElementById('player-box').innerHTML = ''; },

    startVoiceSearch() {
        const rec = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        rec.lang = 'tr-TR';
        rec.onresult = (e) => { this.fetchVideos(e.results[0][0].transcript); };
        rec.start();
    },

    // ŞİFRE PANELİ VE ADMİN
    openLogin() { document.getElementById('login-modal').style.display = 'flex'; },
    closeLogin() { document.getElementById('login-modal').style.display = 'none'; },
    checkLogin() {
        const p = document.getElementById('admin-pass-input').value;
        if(p === this.settings.adminPass) {
            this.closeLogin();
            document.getElementById('admin-panel').style.display = 'block';
            this.renderAdmin();
        } else { alert("ŞİFRE HATALI!"); }
    },

    renderAdmin() {
        document.getElementById('stat-views').innerText = Object.values(this.viewStats).reduce((a,b)=>a+b, 0);
        document.getElementById('stat-coms').innerText = this.comments.length;
        document.getElementById('admin-comments-list').innerHTML = this.comments.map(c => `<div style="padding:10px; border-bottom:1px solid #222;"><small style="color:red">${c.name}</small><p>${c.text}</p></div>`).join('');
    },

    saveSettings() {
        this.settings.logoName = document.getElementById('edit-logo').value || this.settings.logoName;
        this.settings.adminPass = document.getElementById('edit-pass').value || this.settings.adminPass;
        this.settings.themeColor = document.getElementById('edit-color').value;
        this.settings.announcementMsg = document.getElementById('edit-ann-msg').value;
        this.settings.announcementLink = document.getElementById('edit-ann-link').value;
        this.settings.isAnnActive = document.getElementById('edit-ann-status').checked;
        localStorage.setItem('buny_ultimate_cfg', JSON.stringify(this.settings));
        location.reload();
    },

    sendMsg() {
        const n = document.getElementById('msg-name').value;
        const b = document.getElementById('msg-body').value;
        if(n && b) {
            this.comments.push({name: n, text: b});
            localStorage.setItem('buny_comments', JSON.stringify(this.comments));
            alert("İletildi!");
            location.reload();
        }
    }
};
window.onload = () => app.init();
