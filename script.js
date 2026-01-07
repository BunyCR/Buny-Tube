/* [ SCRIPT.JS - AKILLI MOTOR ] */
const sys = {
    key: 'AIzaSyBfXaM09l-IBo2KoDSz02f-4XXD2NoAco0',
    activeId: null,

    ui: {
        openShield: () => document.getElementById('neural-shield').style.display = 'flex',
        closeShield: () => document.getElementById('neural-shield').style.display = 'none',
        minimize: function() {
            document.getElementById('video-target').innerHTML = "";
            document.getElementById('player-overlay').style.display = 'none';
        }
    },

    engine: {
        search: function() {
            const q = document.getElementById('master-query').value;
            if(q) this.fetch(q);
        },

        fetch: async function(q) {
            const box = document.getElementById('feed-box');
            box.innerHTML = `<div style="grid-column:1/-1; text-align:center; padding:50px; color:red;"><i class="fas fa-sync fa-spin fa-2x"></i></div>`;
            try {
                const r = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=15&q=${encodeURIComponent(q)}&type=video&key=${sys.key}`);
                const d = await r.json();
                box.innerHTML = "";
                d.items.forEach(v => this.render(box, v.id.videoId, v.snippet.title, v.snippet.channelTitle, v.snippet.thumbnails.high.url));
            } catch(e) {
                box.innerHTML = `<p style="grid-column:1/-1; text-align:center; padding:50px;">Hata oluştu kanka.</p>`;
            }
        },

        render: function(box, id, title, chan, thumb) {
            const avatar = `https://ui-avatars.com/api/?name=${chan}&background=random&color=fff&bold=true`;
            const div = document.createElement('div');
            div.className = 'card';
            div.onclick = () => this.play(id, title);
            div.innerHTML = `
                <div class="thumb"><img src="${thumb}"></div>
                <div class="meta">
                    <img src="${avatar}" class="avatar">
                    <div class="info">
                        <h3>${title}</h3>
                        <p>${chan} • 2026</p>
                    </div>
                </div>`;
            box.appendChild(div);
        },

        play: function(id, title) {
            document.getElementById('player-overlay').style.display = 'flex';
            document.getElementById('v-title').innerText = title;
            document.getElementById('video-target').innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${id}?autoplay=1" style="width:100%; height:100%; border:none;" allow="autoplay; fullscreen"></iframe>`;
        },

        voice: function() {
            const Rec = window.SpeechRecognition || window.webkitSpeechRecognition;
            if(!Rec) return;
            const s = new Rec(); s.lang = 'tr-TR';
            s.onresult = (e) => {
                document.getElementById('master-query').value = e.results[0][0].transcript;
                this.search();
            };
            s.start();
        }
    }
};

window.onload = () => sys.engine.fetch("2026 teknoloji");
