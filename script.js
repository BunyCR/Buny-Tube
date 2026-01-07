/* [ BUNY-TUBE PRESTIGE - JAVASCRIPT MOTORU ] */
const sys = {
    // YENİ API ANAHTARIN BURADA TANIMLI
    key: 'AIzaSyCr91qNZO-jHaJil5uWLN4W6oO2LbtTWeE', 
    
    ui: {
        openShield: () => document.getElementById('neural-shield').style.display = 'flex',
        closeShield: () => document.getElementById('neural-shield').style.display = 'none',
        closePlayer: () => {
            // SES ÇAKIŞMASINI ÖNLEMEK İÇİN IFRAME'İ TAMAMEN SİLİYORUZ
            document.getElementById('video-frame').innerHTML = "";
            document.getElementById('player-ui').style.display = 'none';
        }
    },

    engine: {
        search: function() {
            const val = document.getElementById('search-input').value;
            if(val) this.fetchVideos(val);
        },

        fetchVideos: async function(query) {
            const feed = document.getElementById('main-feed');
            feed.innerHTML = `<div style="grid-column:1/-1; text-align:center; padding:100px; color:red;"><i class="fas fa-spinner fa-spin fa-3x"></i></div>`;
            
            try {
                const res = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=15&q=${encodeURIComponent(query)}&type=video&key=${sys.key}`);
                const data = await res.json();

                if(!data.items || data.items.length === 0) throw "Hata";

                feed.innerHTML = "";
                data.items.forEach(v => {
                    this.render(feed, v.id.videoId, v.snippet.title, v.snippet.channelTitle, v.snippet.thumbnails.high.url);
                });
            } catch(e) {
                feed.innerHTML = `<div style="text-align:center; padding:50px; color:red;">API Limiti veya Bağlantı Hatası! Muhammed Ali Yedekleri Hazırlıyor...</div>`;
                this.loadBackups(feed);
            }
        },

        loadBackups: function(feed) {
            const backups = [
                {id: 'WpAbtdX5WuU', t: '2026 Mars Hayali Çöktü mü?', c: 'Barış Özcan'},
                {id: 'lXr19zpQ4h0', t: 'Geleceğin Teknolojisi 2026', c: 'Tech Insider'}
            ];
            backups.forEach(v => {
                this.render(feed, v.id, v.t, v.c, `https://img.youtube.com/vi/${v.id}/hqdefault.jpg`);
            });
        },

        render: function(target, id, title, channel, thumb) {
            const avatar = `https://ui-avatars.com/api/?name=${channel}&background=random&color=fff&bold=true`;
            const card = document.createElement('div');
            card.className = 'v-card';
            card.onclick = () => this.play(id, title);
            card.innerHTML = `
                <div class="v-thumb"><img src="${thumb}" loading="lazy"></div>
                <div class="v-meta">
                    <img src="${avatar}" class="v-avatar">
                    <div class="v-info">
                        <h3>${title}</h3>
                        <p>${channel} • 2026 Muhammed Ali</p>
                    </div>
                </div>`;
            target.appendChild(card);
        },

        play: function(id, title) {
            document.getElementById('player-ui').style.display = 'flex';
            document.getElementById('p-title').innerText = title;
            document.getElementById('video-frame').innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0" style="width:100%; height:100%; border:none;" allow="autoplay; fullscreen"></iframe>`;
        }
    }
};

// Sayfa açıldığında teknoloji videolarını getir
window.onload = () => sys.engine.fetchVideos("2026 teknoloji devrimi");