'use strict';

const goodreviewsApiKey = '9b707c29fe99c1f6513fcb545c049ac1'; 
const goodreadsSearchURL = 'https://www.goodreads.com/search/index.xml?';
const tmdbApiKey = 'e24f5fb816587d13d8ea52ce58236e76';
const tmdbMovieSearchURL = 'https://api.themoviedb.org/3/search/movie?';
const tmdbTvSearchURL = 'https://api.themoviedb.org/3/search/tv?';

function formatQueryParams(params) {
    let searchFormat = "";
    for (let [key, value] of Object.entries(params)) {
        searchFormat = searchFormat + key + "=" + value + "&";
    }
    searchFormat = searchFormat.slice(0, -1).replace(/\s/g,'');
    return searchFormat;
}

function searchResults(mediaSearch) {
    const goodreadsParams = {
        api_key: goodreviewsApiKey,
        q: mediaSearch,
    }
    const tmdbParams = {
        api_key: tmdbApiKey,
        query: mediaSearch,
    }
    const grQueryString = formatQueryParams(goodreadsParams);
    const grUrl = goodreadsSearchURL + grQueryString;
    const tmdbQueryString = formatQueryParams(tmdbParams);
    const tmdbMovieUrl = tmdbMovieSearchURL + tmdbQueryString;
    const tmdbTvUrl = tmdbTvSearchURL + tmdbQueryString;

    console.log(grUrl);
    console.log(tmdbMovieUrl);
    console.log(tmdbTvUrl);


}

function clearScreen() {
    $('.welcome-message').addClass('hidden');
    $('.about').addClass('hidden');
    $('.results').removeClass('hidden');
    $('.results').empty();
}

function toggleHighlight(button) {
    button.toggleClass('highlight');
}

function watchTvButton() {
    $('.js-tv-button').click(event => {
        event.preventDefault();
        toggleHighlight($('.js-tv-button'));
    })
}

function watchMoviesButton() {
    $('.js-movies-button').click(event => {
        event.preventDefault();
        toggleHighlight($('.js-movies-button'));
    })
}

function watchBooksButton() {
    $('.js-books-button').click(event => {
        event.preventDefault();
        toggleHighlight($('.js-books-button'));
    })
}

function watchForm() {
    $('form').submit(event => {
      event.preventDefault();
      const mediaSearch = $('.js-media-search').val();
      clearScreen();
      searchResults(mediaSearch);
    });
}

function initializeApp() {
    watchForm();
    watchBooksButton();
    watchMoviesButton();
    watchTvButton();
}
  
  $(initializeApp);