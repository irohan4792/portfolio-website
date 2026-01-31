/* ======================================================
   MUSIC PLAYER - MODULAR FUNCTIONALITY
   ======================================================== */

// Playlist - Add your piano songs here
const playlist = [
	{
		id: 1,
		title: "Closer",
		artist: "Rohan Sharma",
		src: "music/closer.wav"
	},
	{
		id: 2,
		title: "Golden Hour",
		artist: "Rohan Sharma",
		src: "music/golden_hour.wav"
	},
	{
		id: 3,
		title: "Kaise hua",
		artist: "Rohan Sharma",
		src: "music/kaise_hua.wav"
	},
	{
		id: 4,
		title: "Kho Gaye",
		artist: "Rohan Sharma",
		src: "music/kho_gaye.wav"
	},
    {
		id: 5,
		title: "Ranjha",
		artist: "Rohan Sharma",
		src: "music/ranjha.wav"
	},
	{
		id: 6,
		title: "Saiyaara",
		artist: "Rohan Sharma",
		src: "music/saiyara.wav"
	},
    {
		id: 7,
		title: "Wildest Dreams",
		artist: "Rohan Sharma",
		src: "music/wildest_dreams.wav"
	}
];

// Music Player Variables
let currentSongIndex = 0;
let isPlaying = false;

// Get DOM Elements
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

// Initialize Player
function initPlayer() {
	loadSong(currentSongIndex);
	renderPlaylist();
	audio.volume = volumeRange.value / 100;
}

// Load Song
function loadSong(index) {
	if (playlist[index]) {
		const song = playlist[index];
		audio.src = song.src;
		songTitle.textContent = song.title;
		songArtist.textContent = song.artist;
		updatePlaylistHighlight();
	}
}

// Render Playlist
function renderPlaylist() {
	playlistEl.innerHTML = '';
    playlist.sort((a, b) => 
		a.title.localeCompare(b.title, undefined, { sensitivity: 'base' })
	);
	playlist.forEach((song, index) => {
		const li = document.createElement('li');
		li.textContent = song.title + ' - ' + song.artist;
		li.className = 'playlist-item';
		if (index === currentSongIndex) {
			li.classList.add('active');
		}
		li.addEventListener('click', () => {
			currentSongIndex = index;
			loadSong(currentSongIndex);
			playSong();
		});
		playlistEl.appendChild(li);
	});
}

// Update Playlist Highlight
function updatePlaylistHighlight() {
	const items = playlistEl.querySelectorAll('.playlist-item');
	items.forEach((item, index) => {
		item.classList.toggle('active', index === currentSongIndex);
	});
}

// Play Song
function playSong() {
	isPlaying = true;
	audio.play();
	playBtn.innerHTML = '<i class="icon-pause2"></i>';
}

// Pause Song
function pauseSong() {
	isPlaying = false;
	audio.pause();
	playBtn.innerHTML = '<i class="icon-play3"></i>';
}

// Play/Pause Toggle
playBtn.addEventListener('click', () => {
	if (isPlaying) {
		pauseSong();
	} else {
		playSong();
	}
});

// Next Song
nextBtn.addEventListener('click', () => {
	currentSongIndex = (currentSongIndex + 1) % playlist.length;
	loadSong(currentSongIndex);
	playSong();
});

// Previous Song
prevBtn.addEventListener('click', () => {
	currentSongIndex = (currentSongIndex - 1 + playlist.length) % playlist.length;
	loadSong(currentSongIndex);
	playSong();
});

// Update Progress Bar
audio.addEventListener('timeupdate', () => {
	const { currentTime, duration } = audio;
	const progressPercent = (currentTime / duration) * 100;
	progress.style.width = progressPercent + '%';
	progressRange.value = progressPercent;
	
	currentTimeEl.textContent = formatTime(currentTime);
	durationTimeEl.textContent = formatTime(duration);
});

// Set Progress
progressRange.addEventListener('input', (e) => {
	const newTime = (e.target.value / 100) * audio.duration;
	audio.currentTime = newTime;
});

// Volume Control
volumeRange.addEventListener('input', (e) => {
	audio.volume = e.target.value / 100;
});

// Auto Play Next Song
audio.addEventListener('ended', () => {
	currentSongIndex = (currentSongIndex + 1) % playlist.length;
	loadSong(currentSongIndex);
	playSong();
});

// Toggle Playlist Visibility
togglePlaylistBtn.addEventListener('click', () => {
	playlistContainer.style.display = 
		playlistContainer.style.display === 'none' ? 'block' : 'none';
    playlistContainer.style.display=playlistContainer.style.display==='block'?'block':'none';
});

// Toggle Player Minimize
playerToggleBtn.addEventListener('click', () => {
	musicPlayer.classList.toggle('collapsed');
	// Remove animation once user interacts for the first time
	playerToggleBtn.classList.remove('first-time-animation');
});

// Close Player When Clicking Outside
document.addEventListener('click', (e) => {
	// Check if click is outside the music player, toggle button, and playlist
	if (!musicPlayer.contains(e.target) && !playerToggleBtn.contains(e.target) && !playlistContainer.contains(e.target)) {
		// If player is expanded, collapse it
		if (!musicPlayer.classList.contains('collapsed')) {
			musicPlayer.classList.add('collapsed');
		}
	}
});

// Format Time Function
function formatTime(seconds) {
	if (isNaN(seconds)) return '0:00';
	const minutes = Math.floor(seconds / 60);
	const secs = Math.floor(seconds % 60);
	return minutes + ':' + (secs < 10 ? '0' : '') + secs;
}

// Initialize Player on Page Load
document.addEventListener('DOMContentLoaded', () => {
	initPlayer();
	// Start with player collapsed
	musicPlayer.classList.add('collapsed');
	// Add first-time animation class to toggle button
	playerToggleBtn.classList.add('first-time-animation');
});
