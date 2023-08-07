import axios from 'axios';

const key = '38574154-4043e047d2a451e9bea478d9e';
const BASE_URL = 'https://pixabay.com/api/';
let PAGE = 1;

export const fetchImages = async input => {
  PAGE = 1;
  const requestParams = `?key=${key}&q=${input}&image_type=photo&orientation=horizontal&safesearch=true&page=${PAGE}&per_page=40`;
  PAGE += 1;
  return await axios.get(`${BASE_URL}${requestParams}`);
};

export const fetchMoreImages = async localValue => {
  const requestParams = `?key=${key}&q=${localValue}&image_type=photo&orientation=horizontal&safesearch=true&page=${PAGE}&per_page=40`;
  PAGE += 1;
  return await axios.get(`${BASE_URL}${requestParams}`);
};