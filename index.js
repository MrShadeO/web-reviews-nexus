'use strict';

const googleApi = 'AIzaSyDS2P4D4oFIhyLgHO-b-yWwAnAUUFlVgoI';
const googleURL = 'https://www.googleapis.com/books/v1/volumes?';
const tmdbApiKey = 'e24f5fb816587d13d8ea52ce58236e76';
const tmdbMovieSearchURL = 'https://api.themoviedb.org/3/search/movie?';
const tmdbTvSearchURL = 'https://api.themoviedb.org/3/search/tv?';

let bookItem = 0;
let bookList = [];
let movieItem = 0;
let movieList = [];
let tvItem = 0;
let tvList = [];

function displayTvShow() {
    if ($('.js-results-tv-button').hasClass('highlight')) {
        $('.js-tv-score').removeClass('hidden');
        $('.js-tv-search-results').removeClass('hidden');
    }
    if (tvList[tvItem].score == 0) {
        $('.js-tv-score').append(`TV: N/A`)
    } else {
        $('.js-tv-score').append(`TV: ${tvList[tvItem].score}/10`)
    }
    $('.js-tv-search-results').append(
        `<h3>TV Shows</h3>
        <div class='left-right-buttons'>
            <button class="tv-prev-button js-tv-prev-button">Prev</button>
            <p>Item ${tvItem + 1} of ${tvList.length}</p>
            <button class="tv-next-button js-tv-next-button">Next</button>
        </div>
        <h4>${tvList[tvItem].title}</h4>
        <p>Average Score: ${tvList[tvItem].score}/10</p>
        <p>Summary: ${tvList[tvItem].summary}</p>`
    )
}

function displayMovie() {
    if ($('.js-results-movies-button').hasClass('highlight')) {
        $('.js-movie-score').removeClass('hidden');
        $('.js-movies-search-results').removeClass('hidden');
    }
    if (movieList[movieItem].score == 0) {
        $('.js-movie-score').append(`Movie: N/A`)
    } else {
        $('.js-movie-score').append(`Movie: ${movieList[movieItem].score}/10`)
    }
    $('.js-movies-search-results').append(
        `<h3>Movies</h3>
        <div class='left-right-buttons'>
            <button class="movie-prev-button js-movie-prev-button">Prev</button>
            <p>Item ${movieItem + 1} of ${movieList.length}</p>
            <button class="movie-next-button js-movie-next-button">Next</button>
        </div>
        <h4>${movieList[movieItem].title}</h4>
        <p>Average Score: ${movieList[movieItem].score}/10</p>
        <p>Summary: ${movieList[movieItem].summary}</p>`
    )
}

function displayBook() {
    if ($('.js-results-books-button').hasClass('highlight')) {
        $('.js-book-score').removeClass('hidden');
        $('.js-books-search-results').removeClass('hidden');
    }
    if (bookList[bookItem].score == 0) {
        $('.js-book-score').append(`Book: N/A`)
    } else {
        $('.js-book-score').append(`Book: ${bookList[bookItem].score}/10`)
    }
    $('.js-books-search-results').append(
        `<h3>Books</h3>
        <div class='left-right-buttons'>
            <button class="book-prev-button js-book-prev-button">Prev</button>
            <p>Item ${bookItem + 1} of ${bookList.length}</p>
            <button class="book-next-button js-book-next-button">Next</button>
        </div>
        <h4>${bookList[bookItem].title}</h4>
        <p>Average Score: ${bookList[bookItem].score}/10</p>
        <p>Summary: ${bookList[bookItem].summary}</p>`
    )
}

function parseTvResults(responseData) {
    console.log(responseData);

    for (let i=0; i < responseData.results.length; i++) {
        let tvShow = {
            title: responseData.results[i].name,
            score: responseData.results[i].vote_average,
            summary: responseData.results[i].overview,
        }
        tvList.push(tvShow);
    }
    displayTvShow();
}

function parseMovieResults(responseData) {
    console.log(responseData);

    for (let i=0; i < responseData.results.length; i++) {
        let movie = {
            title: responseData.results[i].title,
            score: responseData.results[i].vote_average,
            summary: responseData.results[i].overview,
        }
        movieList.push(movie);
    }  
    displayMovie();
}

function parseBookResults(responseData) {
    console.log(responseData);

    for (let i=0; i < responseData.items.length; i++) {
        let book;
        if (responseData.items[i].volumeInfo.averageRating) {
            book = {
                title: responseData.items[i].volumeInfo.title,
                score: responseData.items[i].volumeInfo.averageRating * 2,
                summary: responseData.items[i].volumeInfo.description,
            }
        } else {
            book = {
                title: responseData.items[i].volumeInfo.title,
                score: 0,
                summary: responseData.items[i].volumeInfo.description,
            }
        }
        bookList.push(book);
    }
    displayBook();
}

function formatQueryParams(params) {
    const queryItems = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
}

function searchResults(mediaSearch) {
    const googleBooksParams = {
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
    const googleBooksQueryString = formatQueryParams(googleBooksParams);
    const gbUrl = googleURL + googleBooksQueryString;
    const tmdbMovieQueryString = formatQueryParams(tmdbMovieParams);
    const tmdbMovieUrl = tmdbMovieSearchURL + tmdbMovieQueryString;
    const tmdbTvQueryString = formatQueryParams(tmdbTvParams);
    const tmdbTvUrl = tmdbTvSearchURL + tmdbTvQueryString;

    console.log(gbUrl);
    console.log(tmdbMovieUrl);
    console.log(tmdbTvUrl);

    //Movie search
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

    //TV search
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

    //Book search
    fetch(gbUrl)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => parseBookResults(responseJson))
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

    bookItem = 0;
    bookList = [];
    movieItem = 0;
    movieList = [];
    tvItem = 0;
    tvList = [];
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

function watchTvPrevButton() {
    $('.js-tv-search-results').on('click', '.js-tv-prev-button', event => {
        event.preventDefault();
        tvItem = tvItem - 1;
        if (tvItem < 0) {
            tvItem = tvList.length - 1;
        }
        $('.js-tv-search-results').empty();
        $('.js-tv-score').empty();
        displayTvShow();
    })
}

function watchTvNextButton() {
    $('.js-tv-search-results').on('click', '.js-tv-next-button', event => {
        event.preventDefault();
        tvItem = tvItem + 1;
        if (tvItem > tvList.length - 1) {
            tvItem = 0;
        }
        $('.js-tv-search-results').empty();
        $('.js-tv-score').empty();
        displayTvShow();
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

function watchMoviePrevButton() {
    $('.js-movies-search-results').on('click', '.js-movie-prev-button', event => {
        event.preventDefault();
        movieItem = movieItem - 1;
        if (movieItem < 0) {
            movieItem = movieList.length - 1;
        }
        $('.js-movies-search-results').empty();
        $('.js-movie-score').empty();
        displayMovie();
    })
}

function watchMovieNextButton() {
    $('.js-movies-search-results').on('click', '.js-movie-next-button', event => {
        event.preventDefault();
        movieItem = movieItem + 1;
        if (movieItem > movieList.length - 1) {
            movieItem = 0;
        }
        $('.js-movies-search-results').empty();
        $('.js-movie-score').empty();
        displayMovie();
    })
}

function watchBooksButton() {
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

function watchBookPrevButton() {
    $('.js-books-search-results').on('click', '.js-book-prev-button', event => {
        event.preventDefault();
        bookItem = bookItem - 1;
        if (bookItem < 0) {
            bookItem = bookList.length - 1;
        }
        $('.js-books-search-results').empty();
        $('.js-book-score').empty();
        displayBook();
    })
}

function watchBookNextButton() {
    $('.js-books-search-results').on('click', '.js-book-next-button', event => {
        event.preventDefault();
        bookItem = bookItem + 1;
        if (bookItem > bookList.length - 1) {
            bookItem = 0;
        }
        $('.js-books-search-results').empty();
        $('.js-book-score').empty();
        displayBook();
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
    watchBooksButton();
    watchBookPrevButton();
    watchBookNextButton();
    watchMoviesButtons();
    watchMoviePrevButton();
    watchMovieNextButton();
    watchTvButtons();
    watchTvPrevButton();
    watchTvNextButton();
}
  
  $(initializeApp);