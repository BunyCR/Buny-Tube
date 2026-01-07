const app = {
    settings: {
        apiKey: 'AIzaSyCr91qNZO-jHaJil5uWLN4W6oO2LbtTWeE',
        logoName: 'BUNY',
        adminPass: '1234'
    },

    init() {
        console.log("Sistem Başlatıldı...");
        const saved = localStorage.getItem('bunyConfig');
        if(saved) this.settings = JSON.parse(saved);
        
        document.getElementById('display-logo').innerText = this.settings.logoName;
        this.fetchVideos("2026 teknoloji");
    },

    // ŞİFRE SORGUSU VE PANEL AÇMA
    openAdmin() {
        console.log("Admin açma isteği geldi");
        const pass = prompt("Şifreyi Girin:");
        if(pass === this.settings.adminPass) {
            document.getElementById('admin-panel').style.display = 'flex';
        } else {
            alert("Şifre Yanlış!");
        }
    },

    closeAdmin() {
        document.getElementById('admin-panel').style.display = 'none';
    },

    saveSettings() {
        this.settings.logoName = document.getElementById('edit-logo').value || this.settings.logoName;
        this.settings.adminPass = document.getElementById('edit-pass').value || this.settings.adminPass;
        this.settings.apiKey = document.getElementById('edit-key').value || this.settings.apiKey;

        localStorage.setItem('bunyConfig', JSON.stringify(this.settings));
        alert("Kaydedildi! Sayfa yenileniyor...");
        location.reload();
    },

    async fetchVideos(q) {
        const feed = document.getElementById('main-feed');
        try {
            const res = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=${q}&type=video&key=${this.settings.apiKey}`);
            const data = await res.json();
            feed.innerHTML = "";
            data.items.forEach(v => {
                const item = document.createElement('div');
                item.className = 'v-card';
                item.onclick = () => alert("Video Oynatıcı Hazırlanıyor: " + v.id.videoId);
                item.innerHTML = `<img src="${v.snippet.thumbnails.high.url}"> <p style="padding:10px">${v.snippet.title}</p>`;
                feed.appendChild(item);
            });
        } catch(e) {
            feed.innerHTML = "API Hatası! Ayarlardan Key'i kontrol et.";
        }
    }
};

// Uygulamayı başlat
window.onload = () => app.init();
