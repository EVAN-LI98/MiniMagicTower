document.addEventListener('DOMContentLoaded', () => {
    const musicControlPanel = document.getElementById('music-control-panel');
    const musicControlIcon = document.getElementById('music-control-icon');
    const prevTrackButton = document.getElementById('prev-track');
    const playPauseButton = document.getElementById('play-pause');
    const nextTrackButton = document.getElementById('next-track');
    const volumeSlider = document.getElementById('volume-slider');
    const currentTrackInfo = document.getElementById('current-track-info');
  
    let audio = new Audio();
    let isPlaying = false;
    let currentTrackIndex = 0;
  
    const tracks = [
      { src: 'MUSIC/backgroundmusic1.mp3', info: 'Track 1 - Artist' },
      { src: 'MUSIC/backgroundmusic2.mp3', info: 'Track 2 - Artist' },
      { src: 'MUSIC/backgroundmusic3.mp3', info: 'Track 3 - Artist' }
    ];
  
    function loadTrack(index) {
      audio.src = tracks[index].src;
      currentTrackInfo.textContent = tracks[index].info;
      audio.load();
    }
  
    function playPause() {
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
      isPlaying = !isPlaying;
      playPauseButton.textContent = isPlaying ? '⏸️' : '⏯️';
    }
  
    function prevTrack() {
      currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
      loadTrack(currentTrackIndex);
      if (isPlaying) audio.play();
    }
  
    function nextTrack() {
      currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
      loadTrack(currentTrackIndex);
      if (isPlaying) audio.play();
    }
  
    audio.addEventListener('ended', () => {
      nextTrack();
    });
  
    volumeSlider.addEventListener('input', (event) => {
      audio.volume = event.target.value / 100;
    });
  
    musicControlPanel.addEventListener('mouseenter', () => {
      musicControlPanel.classList.add('expanded');
      musicControlIcon.style.display = 'none';
    });
  
    musicControlPanel.addEventListener('mouseleave', () => {
      musicControlPanel.classList.remove('expanded');
      musicControlIcon.style.display = 'block';
    });
  
    prevTrackButton.addEventListener('click', prevTrack);
    playPauseButton.addEventListener('click', playPause);
    nextTrackButton.addEventListener('click', nextTrack);
  
    // Load the initial track
    loadTrack(currentTrackIndex);
  
    // Attempt to auto-play on first user interaction
    function startAudioOnInteraction() {
      audio.play().then(() => {
        isPlaying = true;
        playPauseButton.textContent = '⏸️';
      }).catch(error => {
        console.error('Auto-play failed:', error);
      });
      // Remove event listeners after first interaction
      document.removeEventListener('click', startAudioOnInteraction);
      document.removeEventListener('keydown', startAudioOnInteraction);
    }
  
    document.addEventListener('click', startAudioOnInteraction);
    document.addEventListener('keydown', startAudioOnInteraction);
  });
  