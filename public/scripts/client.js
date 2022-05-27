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
            <p>${escape(tweetData.content.text)}</p>
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
  };

  // prevents XSS using an escape function
  const escape = function (string) {
    let div = document.createElement("div");
    div.appendChild(document.createTextNode(string));
    return div.innerHTML;
  };

  // loop over tweets, pass each tweet through createTweetElement and prepends it to the tweets container
  const renderTweets = function (tweets) {

    for (let tweet of tweets) {
      const $tweet = createTweetElement(tweet);
      $(".feed").prepend($tweet);
    }
  };

  // event listener on 'submit' that uses AJAX to POST (send) form data to server (/tweets)
  $("form").on("submit", function(event) {
    // prevent page refresh
    event.preventDefault();
    // error msg that slides up and down
    if (!$('#tweet-text').val().trim()) {
      $('#invalid').text("tweet cannot be empty!");
      $('#invalid').slideDown("slow");
    } else if ($('#tweet-text').val().length > 140) {
      $('#invalid').text("tweet is too long!");
      $('#invalid').slideDown("slow");
    } else {
      $('#invalid').slideUp();
      // turn form data into a query string
      const data = $(this).serialize();

      $.ajax({
        method: "POST",
        url: "/tweets",
        data: data
      })
      .then(function() {
        // resets form then loads new tweet
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

  // animation that toggles form to slide up and down when button is clicked
  $(".toggle-form").click(function() {
    if ($(".new-tweet").is(":hidden")) {
      $(".new-tweet").slideDown();
    $("textarea").focus();
    } else {
      $(".new-tweet").slideUp();
    }
  });

})

