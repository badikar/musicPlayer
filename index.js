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
const totalDuration = getEl('.total-duration');

const trackListDOM = getEl('.list');

let trackIndex = 0;

let isPlaying = false;
let isRepeated = false;
const track = document.createElement('audio');

// Initial load track DOM info
// zeby zaladowac pozniej scr wstaw 2gi argument INXEX.SRC
const renderList = () => {
  const trackList = tracks
    .map((track) => {
      const { title, mood, id } = track;
      return `
      <article class="list-track-info" data-id="${id}">
      <i class="fa fa-play-circle"></i>
      <p>${title}</p>
      <p># ${mood}</p>
      <p>35s</p>
  </article>
      `;
    })
    .join('');
  trackListDOM.innerHTML = trackList;

  const listTrackInfo = [...document.querySelectorAll('.list-track-info')];
  console.log(listTrackInfo);
  listTrackInfo.forEach((track) => {
    track.addEventListener('click', (e) => {
      const selected = e.currentTarget.dataset.id;
      trackIndex = selected - 1;
      console.log(trackIndex);
      loadTrack(trackIndex);
      if (!isPlaying) {
        playTrack();
        track.classList.add('track-active');
        track.firstElementChild.classList.remove('fa-play-circle');
        track.firstElementChild.classList.add('fa-pause-circle');
      } else {
        pauseTrack();
        track.firstElementChild.classList.remove('fa-pause-circle');
        track.firstElementChild.classList.add('fa-play-circle');
      }
    });
  });
};

const start = () => {
  console.log('start');
  loadTrack(trackIndex);
  renderList();
};

function loadTrack(index) {
  trackNumber.innerText = `Playing ${tracks[index].id} of ${tracks.length}`;
  trackName.innerText = tracks[index].title;
  trackMood.innerText = tracks[index].mood;
  track.src = tracks[index].src;
}

function addOpacity() {
  console.log(this);
}

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
  track.play();
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

// const buttons = getEl('.buttons');
// const buttonDivs = [...buttons.querySelectorAll('div')];
// console.log(buttonDivs);

// important - to be used often
// function isTouchScreendevice() {
//   return 'ontouchstart' in window || navigator.maxTouchPoints;
// }

// if (!isTouchScreendevice()) {
//   // alert('hohoh');
//   buttonDivs.forEach((btn) => {
//     btn.addEventListener('mouseenter', () => {
//       btn.classList.add('opacityChange');
//     });
//     btn.addEventListener('mouseleave', () => {
//       btn.classList.remove('opacityChange');
//     });
//   });
// }

// event listeners

// window.addEventListener('DOMContentLoaded', trackListRender);
window.addEventListener('DOMContentLoaded', start);

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

// volume events
track.volume = volumeSlider.value / 100;
volumeSlider.addEventListener('pointerup', () => {
  track.volume = volumeSlider.value / 100;
});
volumeSlider.addEventListener('mousemove', () => {
  track.volume = volumeSlider.value / 100;
});
volumeSlider.addEventListener('pointermove', () => {
  track.volume = volumeSlider.value / 100;
});
