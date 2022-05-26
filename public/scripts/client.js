/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

$(document).ready(() => {
  
  // create new tweet html using tweetData obj
  const createTweetElement = function (tweetData) {
    let $tweet = $(`
    <article class="tweets">
          <header>
            <div>
              <img src="${tweetData.user.avatars}">
              <h2>${tweetData.user.name}</h2>
            </div>
            <p>${tweetData.user.handle}</p>
          </header>
          <div class="tweet">
            <p>${tweetData.content.text}</p>
          </div>
          <footer>
            <div>
              <p>${timeago.format(tweetData.created_at)}</p>
            </div>
            <div>
              <i class="fa-solid fa-flag"></i>
              <i class="fa-solid fa-retweet"></i>
              <i class="fa-solid fa-heart"></i>
            </div>
          </footer>
        </article>
    `);
    return $tweet;
  }

  // loop over tweets, pass each tweet through createTweetElement and appends it to the tweets container
  const renderTweets = function (tweets) {

    for (let tweet of tweets) {
      const $tweet = createTweetElement(tweet);
      $(".feed").append($tweet);
    }
  };

  // event listener on 'submit' that uses AJAX to POST (send) form data to server (/tweets)
  $("form").on("submit", function(event) {
    // prevent page refresh
    event.preventDefault();
    
    if (!$('#tweet-text').val().trim()) {
      alert("tweet cannot be empty!");
    } else if ($('#tweet-text').val().length > 140) {
      alert("tweet is too long!");
    } else {
      // turn form data into a query string
      const data = $(this).serialize();

      $.ajax({
        method: "POST",
        url: "/tweets",
        data: data
      })
      .then(function() {
        $("form").trigger("reset");
      })
      .then(function() {
        loadTweets();
      })
    }

  })

  // use AJAX to GET (fetch) json data from server (/tweets)
  const loadTweets = function () {
    $.ajax({
      method: "GET",
      url: "/tweets",
      dataType: "json"
    })
    .then(function (data) {
      renderTweets(data);
    })
  };
  loadTweets();
})

