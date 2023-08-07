import '../css/common.css';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { listMarkUp } from './markUp';
import { fetchImages, fetchMoreImages } from './fetchImages';
import SimpleLightbox from 'simplelightbox';
// import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { Report } from 'notiflix/build/notiflix-report-aio';
Report.init({
  fontSize: '20px',
  width: '250px',
  position: 'right-top',
});

const formEl = document.querySelector('#search-form');
const loadMoreBtnEl = document.querySelector('.load-more');
const galleryEl = document.querySelector('.gallery');
const btnUp = document.querySelector('.btn-up');


formEl.addEventListener('submit', submitInputData);
loadMoreBtnEl.addEventListener('click', loadMoreData);

function submitInputData(e) {
  e.preventDefault();
  const input = formEl[0].value.trim();
  const localValue = localStorage.getItem('search-word');

  if (!input) {
    Report.warning('Please &#128591;', 'Enter search request.', 'Okay');
    return;
  } else if (input !== localValue) {
    localStorage.setItem('search-word', input);
    fetchImages(input)
      .then(data => {
        renderingData(data);
        simpleLightBoxOn();
      })
      .catch(error => {
        console.log(error);
      });
  }
  formEl.reset();
}


function renderingData(obj) {
  if (obj.data.totalHits === 0) {
    Report.failure(
      'Sorry &#129335;',
      'There are no images matching your search query. Please try again.', 
      'Okay'
    );
    galleryEl.innerHTML = '';
    hideBtn();
  } else {
    Report.success(`Hooray!`, `We found ${obj.data.totalHits} images.`, `Okay`);
    galleryEl.innerHTML = '';
    hideBtn();
    const markUpData = listMarkUp(obj);
    galleryEl.insertAdjacentHTML('afterbegin', markUpData);
    showBtn();
  }
}

function loadMoreData() {
  const localValue = localStorage.getItem('search-word');
  fetchMoreImages(localValue)
    .then(data => {
      moreRenderingData(data);
      simpleLightBoxOn();
    })
    .catch(error => {
      console.log(error);
    });
}

function moreRenderingData(obj) {
  const markUpData = listMarkUp(obj);
  galleryEl.insertAdjacentHTML('beforeend', markUpData);
  const galleryLength = galleryEl.children.length;
  const totalHits = obj.data.totalHits;

  if (totalHits === 0 || galleryLength === totalHits) {
    Report.info(`We're sorry &#129335;`, `But you've reached the end of search results.`, `Okay`);
    hideBtn();
  }
}
const hideBtn = () => {
  loadMoreBtnEl.classList.add('is-hidden');
};

const showBtn = () => {
  loadMoreBtnEl.classList.remove('is-hidden');
};

function simpleLightBoxOn() {
  let gallery = new SimpleLightbox('.gallery a', {
    scrollZoom: false,
    docClose: false,
  });
  gallery.refresh('show.simplelightbox');
}

btnUp.addEventListener('click', scrollToTop);


function scrollToTop() {
    // Перевірка, чи є розмітка для скролу
    if (document.body.scrollHeight > window.innerHeight) {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    }
}

