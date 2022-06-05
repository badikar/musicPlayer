import tracks from './data.js';
import getEl from './getElement.js';

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
let isPlaying = false;
let isRepeated = false;
const track = document.createElement('audio');
// Initial load track DOM info
// zeby zaladowac pozniej scr wstaw 2gi argument INXEX.SRC
function loadTrack(index) {
  trackNumber.innerText = `Playing ${tracks[index].id} of ${tracks.length}`;
  trackName.innerText = tracks[index].title;
  trackMood.innerText = tracks[index].mood;
  track.src = tracks[index].src;
}

function playNext() {
  trackIndex++;
  if (trackIndex > tracks.length - 1) {
    trackIndex = 0;
  }
  loadTrack(trackIndex);
  playTrack();
}

function playPrev() {
  trackIndex--;
  if (trackIndex < 0) {
    trackIndex = tracks.length - 1;
  }
  loadTrack(trackIndex);
  playTrack();
}
function playRandom() {
  trackIndex = Math.floor(Math.random() * tracks.length);
  loadTrack(trackIndex);
  playTrack();
}
function repeatOn() {
  isRepeated = true;
  track.loop = true;
  repeatTrack.classList.add('active');
}
function repeatOff() {
  isRepeated = false;
  track.loop = false;
  repeatTrack.classList.remove('active');
}

function pauseTrack() {
  playPause.children[0].classList.remove('fa-pause-circle');
  playPause.children[0].classList.add('fa-play-circle');
  isPlaying = false;
  track.pause();
}
function playTrack() {
  playPause.children[0].classList.remove('fa-play-circle');
  playPause.children[0].classList.add('fa-pause-circle');
  isPlaying = true;
  track.play();
}

// event listeners
window.addEventListener('DOMContentLoaded', loadTrack(trackIndex));

playPause.addEventListener('click', () => {
  if (isPlaying) {
    pauseTrack();
  } else {
    playTrack();
  }
});
repeatTrack.addEventListener('click', () => {
  if (!isRepeated) {
    repeatOn();
  } else {
    repeatOff();
  }
});
track.addEventListener('ended', () => {
  playNext();
});
nextTrack.addEventListener('pointerdown', playNext);
prevTrack.addEventListener('pointerup', playPrev);
randomTrack.addEventListener('click', playRandom);

const volumeSlider = getEl('.volume-slider');
volumeSlider.addEventListener('click', () => {
  console.log('click touch');
  console.log(volumeSlider.value);
  track.volume = volumeSlider.value / 100;
});
