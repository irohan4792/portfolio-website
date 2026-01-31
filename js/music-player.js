/* ======================================================
   MUSIC PLAYER - FINAL SMART COLLAPSE VERSION
   ====================================================== */

// ---------------- PLAYLIST ----------------
const playlist = [
  {
    id: 1,
    title: "Closer",
    artist: "Rohan Sharma",
    src: "https://github.com/irohan4792/portfolio-website/releases/download/audio-files/closer.wav"
  },
  {
    id: 2,
    title: "Golden Hour",
    artist: "Rohan Sharma",
    src: "https://github.com/irohan4792/portfolio-website/releases/download/audio-files/golden_hour.wav"
  },
  {
    id: 3,
    title: "Kaise hua",
    artist: "Rohan Sharma",
    src: "https://github.com/irohan4792/portfolio-website/releases/download/audio-files/kaise_hua.wav"
  },
  {
    id: 4,
    title: "Kho Gaye",
    artist: "Rohan Sharma",
    src: "https://github.com/irohan4792/portfolio-website/releases/download/audio-files/kho_gaye.wav"
  },
  {
    id: 5,
    title: "Ranjha",
    artist: "Rohan Sharma",
    src: "https://github.com/irohan4792/portfolio-website/releases/download/audio-files/ranjha.wav"
  },
  {
    id: 6,
    title: "Saiyaara",
    artist: "Rohan Sharma",
    src: "https://github.com/irohan4792/portfolio-website/releases/download/audio-files/saiyara.wav"
  },
  {
    id: 7,
    title: "Wildest Dreams",
    artist: "Rohan Sharma",
    src: "https://github.com/irohan4792/portfolio-website/releases/download/audio-files/wildest_dreams.wav"
  }
];


// ---------------- STATE ----------------
let currentSongIndex = 0;
let isPlaying = false;
let wasPlaylistOpen = false;

// ---------------- DOM ----------------
const audio = document.getElementById('audio-player');
const playBtn = document.getElementById('play-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const togglePlaylistBtn = document.getElementById('toggle-playlist-btn');
const playerToggleBtn = document.getElementById('player-toggle');
const progressRange = document.getElementById('progress-range');
const progress = document.getElementById('progress');
const volumeRange = document.getElementById('volume-range');
const songTitle = document.getElementById('song-title');
const songArtist = document.getElementById('song-artist');
const currentTimeEl = document.getElementById('current-time');
const durationTimeEl = document.getElementById('duration-time');
const playlistEl = document.getElementById('playlist');
const musicPlayer = document.getElementById('music-player');
const playlistContainer = document.getElementById('playlist-container');

// ---------------- PLAYER STATE HELPERS ----------------
function expandPlayer() {
	musicPlayer.classList.remove('collapsed');
	if (wasPlaylistOpen) {
		playlistContainer.style.display = 'block';
	}
}

function collapsePlayerFully() {
	wasPlaylistOpen = playlistContainer.style.display === 'block';
	musicPlayer.classList.add('collapsed');
	playlistContainer.style.display = 'none';
}

// ---------------- CORE ----------------
function initPlayer() {
	loadSong(currentSongIndex);
	renderPlaylist();
	audio.volume = volumeRange.value / 100;
}

function loadSong(index) {
	const song = playlist[index];
	if (!song) return;

	audio.src = song.src;
	songTitle.textContent = song.title;
	songArtist.textContent = song.artist;
	updatePlaylistHighlight();
}

function playSong() {
	isPlaying = true;
	audio.play();
	playBtn.innerHTML = '<i class="icon-pause2"></i>';
	expandPlayer();
}

function pauseSong() {
	isPlaying = false;
	audio.pause();
	playBtn.innerHTML = '<i class="icon-play3"></i>';
}

// ---------------- PLAYLIST ----------------
function renderPlaylist() {
	playlistEl.innerHTML = '';

	playlist.sort((a, b) =>
		a.title.localeCompare(b.title, undefined, { sensitivity: 'base' })
	);

	playlist.forEach((song, index) => {
		const li = document.createElement('li');
		li.textContent = `${song.title} - ${song.artist}`;
		li.className = 'playlist-item';

		if (index === currentSongIndex) li.classList.add('active');

		li.addEventListener('click', e => {
			e.stopPropagation();
			currentSongIndex = index;
			loadSong(index);
			playSong();
		});

		playlistEl.appendChild(li);
	});
}

function updatePlaylistHighlight() {
	document.querySelectorAll('.playlist-item').forEach((item, index) => {
		item.classList.toggle('active', index === currentSongIndex);
	});
}

// ---------------- CONTROLS ----------------
playBtn.addEventListener('click', e => {
	e.stopPropagation();
	isPlaying ? pauseSong() : playSong();
});

nextBtn.addEventListener('click', e => {
	e.stopPropagation();
	currentSongIndex = (currentSongIndex + 1) % playlist.length;
	loadSong(currentSongIndex);
	playSong();
});

prevBtn.addEventListener('click', e => {
	e.stopPropagation();
	currentSongIndex = (currentSongIndex - 1 + playlist.length) % playlist.length;
	loadSong(currentSongIndex);
	playSong();
});

// ---------------- PROGRESS ----------------
audio.addEventListener('timeupdate', () => {
	const percent = (audio.currentTime / audio.duration) * 100 || 0;
	progress.style.width = percent + '%';
	progressRange.value = percent;

	currentTimeEl.textContent = formatTime(audio.currentTime);
	durationTimeEl.textContent = formatTime(audio.duration);
});

progressRange.addEventListener('input', e => {
	audio.currentTime = (e.target.value / 100) * audio.duration;
});

// ---------------- VOLUME ----------------
volumeRange.addEventListener('input', e => {
	audio.volume = e.target.value / 100;
});

// ---------------- AUTOPLAY ----------------
audio.addEventListener('ended', () => {
	currentSongIndex = (currentSongIndex + 1) % playlist.length;
	loadSong(currentSongIndex);
	playSong();
});

// ---------------- UI EVENTS ----------------
musicPlayer.addEventListener('click', e => e.stopPropagation());
playlistContainer.addEventListener('click', e => e.stopPropagation());

playerToggleBtn.addEventListener('click', e => {
	e.stopPropagation();
	playerToggleBtn.classList.remove('first-time-animation');

	if (musicPlayer.classList.contains('collapsed')) {
		expandPlayer();
	} else {
		collapsePlayerFully();
	}
});

togglePlaylistBtn.addEventListener('click', e => {
	e.stopPropagation();
	expandPlayer();

	const isOpen = playlistContainer.style.display === 'block';
	playlistContainer.style.display = isOpen ? 'none' : 'block';
	wasPlaylistOpen = !isOpen;
});

document.addEventListener('click', collapsePlayerFully);

// ---------------- UTILS ----------------
function formatTime(seconds) {
	if (!seconds || isNaN(seconds)) return '0:00';
	const m = Math.floor(seconds / 60);
	const s = Math.floor(seconds % 60);
	return `${m}:${s < 10 ? '0' : ''}${s}`;
}

// ---------------- INIT ----------------
document.addEventListener('DOMContentLoaded', () => {
	initPlayer();
	musicPlayer.classList.add('collapsed');
	playerToggleBtn.classList.add('first-time-animation');
});
