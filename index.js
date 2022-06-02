// list of tracks
const tracks = [
  { id: 1, title: 'mango', mood: 'happy', src: './music/mango.mp3' },
  { id: 2, title: 'fryk', mood: 'friki', src: './music/fryk.mp3' },
  { id: 3, title: 'mel', mood: 'calm', src: './music/mel2.mp3' },
];
// DOM helper function
const getEl = (selection) => {
  const element = document.querySelector(selection);
  if (element) return element;
  throw new Error('ooops... no such element exists');
};

//  select DOM elements
const trackNumber = getEl('.now-playing');
const trackName = getEl('.track-name');
const trackMood = getEl('.track-mood');
const playPause = getEl('.play-track');
const randomTrack = getEl('.random-track');
const prevTrack = getEl('.prev-track');
const nextTrack = getEl('.next-track');
const repeatTrack = getEl('.repeat-track');

const totalDuration = getEl('.total-duration');

let trackIndex = 0;
const track = document.createElement('audio');

window.addEventListener('DOMContentLoaded', loadTrack(trackIndex));
// Initial loaded song DOM info
function loadTrack(index) {
  trackNumber.innerText = `Playing ${tracks[index].id} of ${tracks.length}`;
  trackName.innerText = tracks[index].title;
  trackMood.innerText = tracks[index].mood;
  track.src = tracks[index].src;
}

function playNext() {
  console.log(trackIndex);
  console.log(tracks.length);
}

function playPrev() {
  if (trackIndex === 0) {
    trackIndex = tracks.length - 1;
  } else {
    loadTrack(trackIndex--);
    playTrack();
  }
}
function pauseTrack() {
  playPause.children[0].classList.remove('fa-play-circle');
  playPause.children[0].classList.add('fa-pause-circle');
  track.pause();
}
function playTrack() {
  playPause.children[0].classList.remove('fa-pause-circle');
  playPause.children[0].classList.add('fa-play-circle');
  track.play();
}

// event listeners

playPause.addEventListener('click', () => {
  const isPlaying = playPause.querySelector('.fa-play-circle');
  if (isPlaying) {
    pauseTrack();
  } else {
    playTrack();
  }
});
nextTrack.addEventListener('click', playNext);
prevTrack.addEventListener('click', playPrev);
