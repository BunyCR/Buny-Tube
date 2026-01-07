const app = {
    // ... (Eski settings ve init kodları aynı kalacak) ...
    currentVideoId: null,

    async play(id, title) {
        this.currentVideoId = id;
        const player = document.getElementById('player');
        const playerBox = document.getElementById('player-box');
        const suggestions = document.getElementById('suggestion-list');

        player.classList.remove('mini-mode'); // Eğer mini moddaysa büyüt
        player.style.display = 'block';
        
        playerBox.innerHTML = `<iframe id="yt-iframe" src="https://www.youtube.com/embed/${id}?autoplay=1" style="width:100%; height:100%; border:none;" allow="autoplay; fullscreen"></iframe>`;
        
        // Önerileri Getir
        this.fetchSuggestions(title || "popüler teknoloji");
        suggestions.style.display = 'block';
    },

    // VİDEOYU KÜÇÜLT (Mini Player)
    minimize() {
        const player = document.getElementById('player');
        player.classList.add('mini-mode');
        // İsterse kullanıcı mini playera tıklayıp tekrar büyütebilir
        player.onclick = () => {
            if(player.classList.contains('mini-mode')) {
                player.classList.remove('mini-mode');
                player.onclick = null;
            }
        };
    },

    async fetchSuggestions(query) {
        const suggestDiv = document.getElementById('suggestion-list');
        try {
            const res = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=6&q=${encodeURIComponent(query)}&type=video&key=${this.settings.apiKey}`);
            const data = await res.json();
            
            suggestDiv.innerHTML = '<h3 style="color:var(--red); margin-bottom:15px; font-size:0.9rem;">SIRADAKİ VİDEOLAR</h3>' + 
                data.items.map(v => `
                <div class="suggest-card" onclick="app.play('${v.id.videoId}', '${v.snippet.title}')">
                    <img src="${v.snippet.thumbnails.medium.url}">
                    <p>${v.snippet.title}</p>
                </div>
            `).join('');
        } catch(e) { console.log("Öneriler yüklenemedi."); }
    },

    closePlayer() {
        document.getElementById('player').style.display = 'none';
        document.getElementById('player-box').innerHTML = '';
        document.getElementById('suggestion-list').style.display = 'none';
    }
};
