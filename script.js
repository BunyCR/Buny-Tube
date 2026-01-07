const API_KEY = 'AIzaSyBfXaM09l-IBo2KoDSz02f-4XXD2NoAco0';
let currentPlayingVideoId = '';

// Sayfa Yüklendiğinde
window.onload = () => {
    loadHome();
    
    // Enter tuşu ile arama yapma
    document.getElementById('search-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') search();
    });
};

// Ana Sayfa Trendleri
async function loadHome() {
    updateActiveNav(0);
    const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&chart=mostPopular&regionCode=TR&maxResults=20&key=${API_KEY}`;
    fetchAndRender(url);
}

// Arama Fonksiyonu
async function search(customQuery = null) {
    const q = customQuery || document.getElementById('search-input').value;
    if(!q) return;
    
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${q}&type=video&maxResults=20&key=${API_KEY}`;
    fetchAndRender(url, true);
}

// Shorts Yükle
async function loadShorts() {
    updateActiveNav(1);
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=shorts&type=video&videoDuration=short&maxResults=20&key=${API_KEY}`;
    fetchAndRender(url, true);
}

// Veriyi Çek ve Ekrana Bas
async function fetchAndRender(url, isSearch = false) {
    const grid = document.getElementById('video-grid');
    grid.innerHTML = "<div class='loader'>Yükleniyor...</div>";
    
    try {
        const res = await fetch(url);
        const data = await res.json();
        grid.innerHTML = "";
        
        let videoItems = data.items;

        // Arama sonuçlarında istatistik (izlenme) gelmez, o yüzden videoları tekrar çekiyoruz
        if (isSearch) {
            const videoIds = data.items.map(item => item.id.videoId).filter(id => id).join(',');
            const detailRes = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoIds}&key=${API_KEY}`);
            const detailData = await detailRes.json();
            videoItems = detailData.items;
        }

        videoItems.forEach(item => {
            const id = item.id.videoId || item.id;
            const v = item.snippet;
            const stats = item.statistics;
            const title = v.title.replace(/'/g, "\\'");

            grid.innerHTML += `
                <div class="video-card" onclick="openVideo('${id}', '${title}', '${formatViews(stats ? stats.viewCount : 0)}')">
                    <div class="thumbnail-container">
                        <img src="${v.thumbnails.high.url}">
                    </div>
                    <div class="video-info">
                        <div class="channel-icon-mini"></div>
                        <div class="v-text">
                            <h3>${v.title}</h3>
                            <p>${v.channelTitle} • ${formatViews(stats ? stats.viewCount : 0)} izlenme</p>
                        </div>
                    </div>
                </div>`;
        });
    } catch (e) {
        grid.innerHTML = "<p style='text-align:center;'>Bağlantı Hatası!</p>";
    }
}

// İzlenme Sayısı Formatla
function formatViews(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'B';
    return num;
}

// Video Oynatıcıyı Aç
function openVideo(id, title, views) {
    currentPlayingVideoId = id;
    document.getElementById('player').style.display = 'flex';
    document.getElementById('player-title').innerText = title;
    document.getElementById('v-title-full').innerText = title;
    document.getElementById('v-stats').innerText = views + " izlenme • Reklamsız Mod";
    
    document.getElementById('iframe-container').innerHTML = `
        <iframe src="https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0" 
        allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
}

// Kapat
function closeVideo() {
    document.getElementById('player').style.display = 'none';
    document.getElementById('iframe-container').innerHTML = "";
}

// Video İndir
function downloadVideo() {
    if (currentPlayingVideoId) {
        window.open(`https://www.ssyoutube.com/watch?v=${currentPlayingVideoId}`, '_blank');
    }
}

// Kategori Seçimi
function selectCategory(el, query) {
    document.querySelectorAll('.cat-item').forEach(c => c.classList.remove('active'));
    el.classList.add('active');
    if(query === '') loadHome();
    else search(query);
}

// Alt Menü Aktiflik
function updateActiveNav(index) {
    document.querySelectorAll('.nav-item').forEach((n, i) => {
        if(i === index) n.classList.add('active');
        else n.classList.remove('active');
    });
}
