'use strict';

const googleURL = 'https://www.googleapis.com/books/v1/volumes?';
const tmdbApiKey = 'e24f5fb816587d13d8ea52ce58236e76';
const tmdbMovieSearchURL = 'https://api.themoviedb.org/3/search/movie?';
const tmdbTvSearchURL = 'https://api.themoviedb.org/3/search/tv?';

/*
The following variables are used to store info from a search's results. List arrays hold every item found in a search and the Item variables
are the current positions in the relevant arrays. 
*/
let bookItem = 0;
let bookList = [];
let movieItem = 0;
let movieList = [];
let tvItem = 0;
let tvList = [];

/*
The following three functions are called when no search results are returned from a fetch request to their associated APIs or if the search 
results contain nothing.
*/
function displayNoMovieResults() {
    if ($('.js-results-movies-button').hasClass('highlight')) {
        $('.js-movies-search-results').removeClass('hidden');
    }
    $('.js-movies-search-results').append('<p class="title">No movies found.</p>');
}

function displayNoTvResults() {
    if ($('.js-results-tv-button').hasClass('highlight')) {
        $('.js-tv-search-results').removeClass('hidden');
    }
    $('.js-tv-search-results').append('<p class="title">No TV shows found.</p>');
}

function displayNoBookResults() {
    if ($('.js-results-books-button').hasClass('highlight')) {
        $('.js-books-search-results').removeClass('hidden');
    }
    $('.js-books-search-results').append('<p class="title">No books found.</p>');
}

/*
Takes the TV list and the current position in the books list to display relevant search info. Ensures that info is displayed when user clicks a 
media button after a search has been performed.
*/
function displayTvShow() {
    if ($('.js-results-tv-button').hasClass('highlight')) {
        $('.js-tv-score').removeClass('hidden');
        $('.js-tv-search-results').removeClass('hidden');
    }
    if (tvList[tvItem].score == 0) {
        $('.js-tv-score').append(`<span class="make-bold">TV:</span> N/A`)
    } else {
        $('.js-tv-score').append(`<span class="make-bold">TV:</span> ${tvList[tvItem].score}`)
    }
    $('.js-tv-search-results').append(
        `<h3>TV Shows</h3>
        <div class='left-right-buttons'>
            <button class="tv-prev-button js-tv-prev-button">Prev</button>
            <p>Item ${tvItem + 1} of ${tvList.length}</p>
            <button class="tv-next-button js-tv-next-button">Next</button>
        </div>
        <img class="tv-show-poster" src="${tvList[tvItem].image}" alt="Image of tv show poster">
        <h4 class="title">${tvList[tvItem].title}</h4>
        <p><span class="make-bold">Average Score:</span> ${tvList[tvItem].score}</p>
        <p><span class="make-bold">Summary:</span> ${tvList[tvItem].summary}</p>`
    )
}

/*
Takes the movies list and the current position in the movies list to display relevant search info. Ensures that info is displayed when user clicks a 
media button after a search has been performed.
*/
function displayMovie() {
    if ($('.js-results-movies-button').hasClass('highlight')) {
        $('.js-movie-score').removeClass('hidden');
        $('.js-movies-search-results').removeClass('hidden');
    }
    if (movieList[movieItem].score == 0) {
        $('.js-movie-score').append(`<span class="make-bold">Movie:</span> N/A`)
    } else {
        $('.js-movie-score').append(`<span class="make-bold">Movie:</span> ${movieList[movieItem].score}`)
    }
    $('.js-movies-search-results').append(
        `<h3>Movies</h3>
        <div class='left-right-buttons'>
            <button class="movie-prev-button js-movie-prev-button">Prev</button>
            <p>Item ${movieItem + 1} of ${movieList.length}</p>
            <button class="movie-next-button js-movie-next-button">Next</button>
        </div>
        <img class="movie-poster" src="${movieList[movieItem].image}" alt="Image of movie poster">
        <h4 class="title">${movieList[movieItem].title}</h4>
        <p><span class="make-bold">Average Score:</span> ${movieList[movieItem].score}</p>
        <p><span class="make-bold">Summary:</span> ${movieList[movieItem].summary}</p>`
    )
}

/*
Takes the books list and the current position in the books list to display relevant search info. Ensures that info is displayed when user clicks a 
media button after a search has been performed.
*/
function displayBook() {
    if ($('.js-results-books-button').hasClass('highlight')) {
        $('.js-book-score').removeClass('hidden');
        $('.js-books-search-results').removeClass('hidden');
    }
    if (bookList[bookItem].score == 0) {
        $('.js-book-score').append(`<span class="make-bold">Book:</span> N/A`)
    } else {
        $('.js-book-score').append(`<span class="make-bold">Book:</span> ${bookList[bookItem].score}`)
    }
    $('.js-books-search-results').append(
        `<h3>Books</h3>
        <div class='left-right-buttons'>
            <button class="book-prev-button js-book-prev-button">Prev</button>
            <p>Item ${bookItem + 1} of ${bookList.length}</p>
            <button class="book-next-button js-book-next-button">Next</button>
        </div>
        <img class="book-cover" src="${bookList[bookItem].image}" alt="Image of book's cover.">
        <h4 class="title">${bookList[bookItem].title}</h4>
        <p><span class="make-bold">Authors:</span> ${bookList[bookItem].authors}</p>
        <p><span class="make-bold">Average Score:</span> ${bookList[bookItem].score}</p>
        <p><span class="make-bold">Summary:</span> ${bookList[bookItem].summary}</p>`
    )
}

/*
Takes the response data from the TMDB TV show database and parses through to find the relevant info and put it in a smaller array that will be used by
all subsequent functions.
*/
function parseTvResults(responseData) {
    console.log(responseData);

    for (let i=0; i < responseData.results.length; i++) {
        let tvShow;
        if (responseData.results[i].poster_path) {
            tvShow = {
                title: responseData.results[i].name,
                score: responseData.results[i].vote_average + "/10",
                summary: responseData.results[i].overview,
                image: "https://image.tmdb.org/t/p/w185" + responseData.results[i].poster_path,
            } 
        } else {
            tvShow = {
                title: responseData.results[i].name,
                score: responseData.results[i].vote_average + "/10",
                summary: responseData.results[i].overview,
                image: "https://lh3.googleusercontent.com/proxy/gjwBaYPv5xPgYTJzyfbSIz4WjHHO35Vg0-15Aj-Cl3H1UaRBJ3qBKibkSNmhOWbHI-beigf0iXpbAE85o6l40YWixXuAJXkAmaNZmoN0caTku0sGhWu22AdIVk8euiyr0rnYi04_", 
            }
        }
        if (tvShow.summary.length == 0) {
            tvShow.summary = "No synopsis found.";
        }
        if (tvShow.score == "0/10") {
            tvShow.score = "N/A";
        }
        tvList.push(tvShow);
    }
    displayTvShow();
}

/*
Takes the response data from the TMDB movie database and parses through to find the relevant info and put it in a smaller array that will be used by
all subsequent functions.
*/
function parseMovieResults(responseData) {
    console.log(responseData);

    for (let i=0; i < responseData.results.length; i++) {
        let movie;
        if (responseData.results[i].poster_path) {
            movie = {
                title: responseData.results[i].title,
                score: responseData.results[i].vote_average + "/10",
                summary: responseData.results[i].overview,
                image: "https://image.tmdb.org/t/p/w185" + responseData.results[i].poster_path,
            }
        } else {
            movie = {
                title: responseData.results[i].title,
                score: responseData.results[i].vote_average + "/10",
                summary: responseData.results[i].overview,
                image: "https://lh3.googleusercontent.com/proxy/gjwBaYPv5xPgYTJzyfbSIz4WjHHO35Vg0-15Aj-Cl3H1UaRBJ3qBKibkSNmhOWbHI-beigf0iXpbAE85o6l40YWixXuAJXkAmaNZmoN0caTku0sGhWu22AdIVk8euiyr0rnYi04_",
            }
        }
        if (movie.summary.length == 0) {
            movie.summary = "No synopsis found.";
        }
        if (movie.score == "0/10") {
            movie.score = "N/A";
        }
        movieList.push(movie);
    }  
    displayMovie();
}

/*
Takes the response data from the Google Books database and parses through to find the relevant info and put it in a smaller array that will be used by
all subsequent functions.
*/
function parseBookResults(responseData) {
    console.log(responseData);

    for (let i=0; i < responseData.items.length; i++) {
        let book;
        let authorList = responseData.items[i].volumeInfo.authors.join(", ");
        let securedLink = responseData.items[i].volumeInfo.imageLinks.smallThumbnail.replace("http", "https");
        if (responseData.items[i].volumeInfo.averageRating) {
            book = {
                title: responseData.items[i].volumeInfo.title,
                score: (responseData.items[i].volumeInfo.averageRating * 2) + "/10",
                summary: responseData.items[i].volumeInfo.description,
                image: securedLink,
                authors: authorList,
            }
        } else {
            book = {
                title: responseData.items[i].volumeInfo.title,
                score: "N/A",
                summary: responseData.items[i].volumeInfo.description,
                image: securedLink,
                authors: authorList,
            }
        }
        if (!responseData.items[i].volumeInfo.imageLinks.smallThumbnail) {
            book.image = "https://lh3.googleusercontent.com/proxy/gjwBaYPv5xPgYTJzyfbSIz4WjHHO35Vg0-15Aj-Cl3H1UaRBJ3qBKibkSNmhOWbHI-beigf0iXpbAE85o6l40YWixXuAJXkAmaNZmoN0caTku0sGhWu22AdIVk8euiyr0rnYi04_";
        }
        if (book.summary.length == 0) {
            book.summary = "No synopsis found.";
        }
        bookList.push(book);
    }
    displayBook();
}

//Encodes parameters to be used in the search URL.
function formatQueryParams(params) {
    const queryItems = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
}

//This function takes the users query and developer's API keys to create parameters, edit URLs, and perform a search to the Google Books and TMDB databases.
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
      displayNoBookResults();
    });

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
      displayNoMovieResults();
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
      displayNoTvResults();
    });

}

//Toggle functions are needed for the media buttons to be turned on and off.
function toggleHidden(toHide) {
    toHide.toggleClass('hidden');
}

function toggleHighlight(button) {
    button.toggleClass('highlight');
}

/*
This function hides the homepage info, causes all results to be hidden, and resets variables for all search lists and the positions in each list. Another function ensures that 
if the media buttons are selected during a search, then the results will be revealed again.
*/
function clearScreen() {
    $('.js-welcome-message').addClass('hidden');
    $('.js-about').addClass('hidden');
    $('.homepage-image').addClass('hidden');

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
    $('.js-results-tv-button').addClass('highlight');
    $('.js-results-movies-button').addClass('highlight');
    $('.js-results-books-button').addClass('highlight');

    bookItem = 0;
    bookList = [];
    movieItem = 0;
    movieList = [];
    tvItem = 0;
    tvList = [];
}

/*
Toggles between whether or not TV shows will be displayed at all. Buttons near search bar determine what will be initially displayed when a new search occurs. Buttons above
the search results determine what will be displayed for the current search.
*/
function watchTvButton() {
    $('.js-results-tv-button').click(event => {
        event.preventDefault();
        toggleHighlight($('.js-results-tv-button'));
        toggleHidden($('.js-tv-score'));
        toggleHidden($('.js-tv-search-results'));
    })
}

//Changes which TV show will be viewed by moving backwards through the TV array.
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

//Changes which TV show will be viewed by moving forward through the TV array.
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

/*
Toggles between whether or not movies will be displayed at all. Buttons near search bar determine what will be initially displayed when a new search occurs. Buttons above
the search results determine what will be displayed for the current search.
*/
function watchMoviesButton() {
    $('.js-results-movies-button').click(event => {
        event.preventDefault();
        toggleHighlight($('.js-results-movies-button'));
        toggleHidden($('.js-movie-score'));
        toggleHidden($('.js-movies-search-results'));
    })
}

//Changes which movie will be viewed by moving backwards through the movies array.
function watchMoviesPrevButton() {
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

//Changes which movie will be viewed by moving forward through the movies array.
function watchMoviesNextButton() {
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

/*
Toggles between whether or not books will be displayed at all. Buttons near search bar determine what will be initially displayed when a new search occurs. Buttons above
the search results determine what will be displayed for the current search.
*/
function watchBooksButton() {
    $('.js-results-books-button').click(event => {
        event.preventDefault();
        toggleHighlight($('.js-results-books-button'));
        toggleHidden($('.js-book-score'));
        toggleHidden($('.js-books-search-results'));
    })
}

//Changes which book will be viewed by moving backwards through the books array.
function watchBooksPrevButton() {
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

//Changes which book will be viewed by moving forward through the books array.
function watchBooksNextButton() {
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

//Waits for user to hit submit button, then begins search process.
function watchForm() {
    $('.js-search-form').submit(event => {
      event.preventDefault();
      const mediaSearch = $('.js-media-search').val();
      clearScreen();
      searchResults(mediaSearch);
    });
}

//Creates event listeners for buttons.
function initializeApp() {
    watchForm();
    watchBooksButton();
    watchBooksPrevButton();
    watchBooksNextButton();
    watchMoviesButton();
    watchMoviesPrevButton();
    watchMoviesNextButton();
    watchTvButton();
    watchTvPrevButton();
    watchTvNextButton();
}
  
  $(initializeApp);