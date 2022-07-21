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
const volumeSlider = getEl('.volume-slider');
// const seekSlider = getEl('.seek-slider');
const currentTimeDOM = getEl('.current-time');
const totalDuration = getEl('.total-duration');

const listDOM = getEl('.list');

let trackIndex = 0;

let isPlaying = false;
let isRepeated = false;
let track = document.createElement('audio');

const renderList = () => {
  const trackList = tracks
    .map((singleTrack) => {
      const { title, mood, id } = singleTrack;
      return `
    <article class="list-track-info" data-id="${id}">
    <i class="fa fa-play-circle"></i>
    <p class="song-title">${title}</p>
    <p class="song-mood"># ${mood}</p>
    </article>
    `;
    })
    .join('');
  listDOM.innerHTML = trackList;
};

renderList();

const listTrackInfo = [...document.querySelectorAll('.list-track-info')];

//  load track DOM info
function loadTrack(index) {
  trackNumber.innerText = `Playing ${tracks[index].id} of ${tracks.length}`;
  trackName.innerText = tracks[index].title;
  trackMood.innerText = tracks[index].mood;
  track.src = tracks[index].src;
  track.setAttribute('preload', 'metadata');
  track.onloadedmetadata = function () {
    totalDuration.innerText = formatDuration(track.duration);
  };

  listTrackInfo.forEach((trak) => {
    trak.classList.remove('track-active');
    trak.children[0].classList.add('fa-play-circle');
  });
}

loadTrack(trackIndex);

listTrackInfo.forEach((trak) => {
  trak.addEventListener('click', function (e) {
    const selected = e.currentTarget.dataset.id;
    trackIndex = selected - 1;
    loadTrack(trackIndex);
    playTrack();
  });
});

// player buttons functionality
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
  listTrackInfo[trackIndex].classList.add('track-active');
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
  listTrackInfo[trackIndex].children[0].classList.add('fa-play-circle');
  listTrackInfo[trackIndex].children[0].classList.remove('fa-pause-circle');
}
function playTrack() {
  listTrackInfo[trackIndex].classList.add('track-active');
  track.play();
  isPlaying = true;
  playPause.children[0].classList.remove('fa-play-circle');
  playPause.children[0].classList.add('fa-pause-circle');
  listTrackInfo[trackIndex].children[0].classList.remove('fa-play-circle');
  listTrackInfo[trackIndex].children[0].classList.add('fa-pause-circle');
}

// event listeners

// window.addEventListener('DOMContentLoaded', start);

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

nextTrack.addEventListener('click', playNext);
nextTrack.addEventListener('click', playNext);

prevTrack.addEventListener('click', playPrev);
randomTrack.addEventListener('click', playRandom);

// volume slider
// track.volume = volumeSlider.value / 100;
// volumeSlider.addEventListener('pointerup', () => {
//   track.volume = volumeSlider.value / 100;
// });
// volumeSlider.addEventListener('mousemove', () => {
//   track.volume = volumeSlider.value / 100;
// });
// volumeSlider.addEventListener('pointermove', () => {
//   track.volume = volumeSlider.value / 100;
// });

// ********************************

const timelineContainer = getEl('.timeline-container');

timelineContainer.addEventListener('pointermove', updateTimeline);
timelineContainer.addEventListener('pointerdown', updateTimeline);
timelineContainer.addEventListener('touchmove', updateTimeline);

function updateTimeline(e) {
  if (e.buttons & (1 === 1)) {
    const rect = timelineContainer.getBoundingClientRect();
    console.log(rect.width);
    const percent = Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width;
    timelineContainer.style.setProperty('--progres-position', percent);
    track.currentTime = percent * track.duration;
  }
}

function updateProgress() {
  const percent = track.currentTime / track.duration;
  // console.log(percent);
  timelineContainer.style.setProperty('--progres-position', percent);

  currentTimeDOM.innerText = timeDisplay(track.currentTime);
}

// all audio tracks < 1min so used quicker way
function timeDisplay(value) {
  if (value < 10) {
    return `00:0${Math.floor(value)}`;
  } else {
    return `00:${Math.floor(value)}`;
  }
}

// duration slider
track.addEventListener('timeupdate', updateProgress);
// seekSlider.addEventListener('pointermove', setProgress);
track.addEventListener('timeupdate', updateProgress);

const volumeSliderContainer = getEl('.volume-slider-container');

function setVolume(e) {
  if (e.buttons & (1 === 1)) {
    const rect = volumeSliderContainer.getBoundingClientRect();
    console.log(rect.width);
    const percent = Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width;

    volumeSliderContainer.style.setProperty('--progres-position', percent);
    track.volume = percent;
  }
}

volumeSliderContainer.addEventListener('pointermove', setVolume);
volumeSliderContainer.addEventListener('pointerdown', setVolume);
volumeSliderContainer.addEventListener('touchmove', setVolume);

// total duration
const leadingZeroFormatter = new Intl.NumberFormat(undefined, {
  minimumIntegerDigits: 2,
});

function formatDuration(time) {
  const seconds = Math.floor(time % 60);
  const minutes = Math.floor(time / 60) % 60;
  const hours = Math.floor(time / 3600);
  if (hours === 0) {
    return `${minutes}:${leadingZeroFormatter.format(seconds)}`;
  } else {
    return `${hours}:${leadingZeroFormatter.format(minutes)}:${leadingZeroFormatter.format(
      seconds
    )}`;
  }
}
