'use strict';

const goodreadsApiKey = '9b707c29fe99c1f6513fcb545c049ac1'; 
const goodreadsSearchURL = 'https://www.goodreads.com/search/index.xml?';
const tmdbApiKey = 'e24f5fb816587d13d8ea52ce58236e76';
const tmdbMovieSearchURL = 'https://api.themoviedb.org/3/search/movie?';
const tmdbTvSearchURL = 'https://api.themoviedb.org/3/search/tv?';

function displayTvShow(tvShow) {
    if ($('.js-results-tv-button').hasClass('highlight')) {
        toggleHidden($('.js-tv-score'));
        toggleHidden($('.js-tv-search-results'));
    }
    if (tvShow.score == 0) {
        $('.js-tv-score').append(`TV: N/A`)
    } else {
        $('.js-tv-score').append(`TV: ${tvShow.score}/10`)
    }
    $('.js-tv-search-results').append(
        `<h3>TV Shows</h3>
        <h4>${tvShow.title}</h4>
        <p>Average Score: ${tvShow.score}/10</p>
        <p>Summary: ${tvShow.summary}</p>`
    )
}

function displayMovie(movie) {
    if ($('.js-results-movies-button').hasClass('highlight')) {
        toggleHidden($('.js-movie-score'));
        toggleHidden($('.js-movies-search-results'));
    }
    if (movie.score == 0) {
        $('.js-movie-score').append(`Movie: N/A`)
    } else {
        $('.js-movie-score').append(`Movie: ${movie.score}/10`)
    }
    $('.js-movies-search-results').append(
        `<h3>Movies</h3>
        <h4>${movie.title}</h4>
        <p>Average Score: ${movie.score}/10</p>
        <p>Summary: ${movie.summary}</p>`
    )
}

function parseTvResults(responseData) {
    console.log(responseData);
    let tvResults = [];
    for (let i=0; i < responseData.results.length; i++) {
        let tvShow = {
            title: responseData.results[i].name,
            score: responseData.results[i].vote_average,
            summary: responseData.results[i].overview,
        }
        tvResults.push(tvShow);
    }
    displayTvShow(tvResults[0]);
}

function parseMovieResults(responseData) {
    console.log(responseData);

    let movieResults = [];
    for (let i=0; i < responseData.results.length; i++) {
        let movie = {
            title: responseData.results[i].title,
            score: responseData.results[i].vote_average,
            summary: responseData.results[i].overview,
        }
        movieResults.push(movie);
    }  
    displayMovie(movieResults[0]);
}

function formatQueryParams(params) {
    const queryItems = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
}

function searchResults(mediaSearch) {
    const goodreadsParams = {
        api_key: goodreadsApiKey,
        q: mediaSearch,
    }
    const tmdbMovieParams = {
        api_key: tmdbApiKey,
        query: mediaSearch,
        language: 'en-US',
        include_adult: 'false',
    }
    const tmdbTvParams = {
        api_key: tmdbApiKey,
        query: mediaSearch,
        language: 'en-US',
    }
    const grQueryString = formatQueryParams(goodreadsParams);
    const grUrl = goodreadsSearchURL + grQueryString;
    const tmdbMovieQueryString = formatQueryParams(tmdbMovieParams);
    const tmdbMovieUrl = tmdbMovieSearchURL + tmdbMovieQueryString;
    const tmdbTvQueryString = formatQueryParams(tmdbTvParams);
    const tmdbTvUrl = tmdbTvSearchURL + tmdbTvQueryString;

    console.log(grUrl);
    console.log(tmdbMovieUrl);
    console.log(tmdbTvUrl);

    fetch(tmdbMovieUrl)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => parseMovieResults(responseJson))
    .catch(err => {
      console.log("Something went wrong.");
    });

    fetch(tmdbTvUrl)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => parseTvResults(responseJson))
    .catch(err => {
      console.log("Something went wrong.");
    });
}

function toggleHidden(toHide) {
    toHide.toggleClass('hidden');
}

function toggleHighlight(button) {
    button.toggleClass('highlight');
}

function copyHighlights() {
    if($('.js-movies-button').hasClass('highlight')) {
        $('.js-results-movies-button').addClass('highlight');
    }
    if($('.js-tv-button').hasClass('highlight')) {
        $('.js-results-tv-button').addClass('highlight');
    }
    if($('.js-books-button').hasClass('highlight')) {
        $('.js-results-books-button').addClass('highlight');
    }
}

function clearScreen() {
    $('.js-welcome-message').addClass('hidden');
    $('.js-about').addClass('hidden');

    $('.js-book-score').addClass('hidden');
    $('.js-movie-score').addClass('hidden');
    $('.js-tv-score').addClass('hidden');
    $('.js-book-score').empty();
    $('.js-movie-score').empty();
    $('.js-tv-score').empty();

    $('.js-books-search-results').addClass('hidden');
    $('.js-movies-search-results').addClass('hidden');
    $('.js-tv-search-results').addClass('hidden');
    $('.js-books-search-results').empty();
    $('.js-movies-search-results').empty();
    $('.js-tv-search-results').empty();

    $('.js-results').removeClass('hidden');
    $('.js-results-tv-button').removeClass('highlight');
    $('.js-results-movies-button').removeClass('highlight');
    $('.js-results-books-button').removeClass('highlight');
}

function watchTvButtons() {
    $('.js-tv-button').click(event => {
        event.preventDefault();
        toggleHighlight($('.js-tv-button'));
    })
    $('.js-results-tv-button').click(event => {
        event.preventDefault();
        toggleHighlight($('.js-results-tv-button'));
        toggleHidden($('.js-tv-score'));
        toggleHidden($('.js-tv-search-results'));
    })
}

function watchMoviesButtons() {
    $('.js-movies-button').click(event => {
        event.preventDefault();
        toggleHighlight($('.js-movies-button'));
    })
    $('.js-results-movies-button').click(event => {
        event.preventDefault();
        toggleHighlight($('.js-results-movies-button'));
        toggleHidden($('.js-movie-score'));
        toggleHidden($('.js-movies-search-results'));
    })
}

function watchBooksButtons() {
    $('.js-books-button').click(event => {
        event.preventDefault();
        toggleHighlight($('.js-books-button'));
    })
    $('.js-results-books-button').click(event => {
        event.preventDefault();
        toggleHighlight($('.js-results-books-button'));
        toggleHidden($('.js-book-score'));
        toggleHidden($('.js-books-search-results'));
    })
}

function watchForm() {
    $('.js-search-form').submit(event => {
      event.preventDefault();
      const mediaSearch = $('.js-media-search').val();
      clearScreen();
      copyHighlights();
      searchResults(mediaSearch);
    });
}

function initializeApp() {
    watchForm();
    watchBooksButtons();
    watchMoviesButtons();
    watchTvButtons();
}
  
  $(initializeApp);