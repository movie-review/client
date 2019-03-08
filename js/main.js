function navPopular() {
  event.preventDefault();
  $('#search-nav').hide();
  $('#movie-list').empty();
  $('#movie--section .spinner').show();

  $.ajax({
    method: 'get',
    url: 'http://localhost:3000/tmdb/movies/popular'
  })
    .done(response => {
      console.log(response);
      let movies = response['results'];
      $('#movie--section .spinner').hide();
      // console.log(movies);
      $.each(movies, (idx, movie) => {
        if (movie.poster_path) {
          $('#movie-list').append(`
              <div class="col-md-4">
                <div class="card mb-3">
                  <img src="http://image.tmdb.org/t/p/w342/${movie.poster_path}" class="card-img-top">
                  <div class="card-body">
                    <h5 class="card-title">${movie.title}</h5>
                    <h6 class="card-subtitle mb-2 text-muted">${movie.release_date.slice(0, 4)}</h6>
                    <a href="#" class="card-link see-detail" data-toggle="modal" data-target="#exampleModal" data-id="${movie.id}">See Detail</a>
                  </div>
                </div>
              </div>
              `).hide().fadeIn(400);
        }
      });
    })
    .fail(err => {

    });
}



function navSearch() {
  event.preventDefault();

  $('#search-nav').show();
  $('#movie-list').empty();
  $('#search-input').val('');
}

function onSignIn(googleUser) {
  let id_token = googleUser.getAuthResponse().id_token;
  $.ajax(
    {
      url: `http://localhost:3000/users/googleSignIn`,
      method: 'POST',
      data: { id_token }
    })
    .done(function (response) {
      console.log("======================");
      console.log(response);
      localStorage.setItem('token', response.token)
      $('#g-signin-button').hide();
      $('#user-info').show()
      $('#signout-button').show()
      $('#isLogin').show();
      $('#notLogin').hide();

      $('#currentUser').html(`
        <a class="nav-item nav-link">${response.name}</a>
      `)
    })
    .fail(function (err) {
      console.log(err);
    })
}

function signOut() {
  var auth2 = gapi.auth2.getAuthInstance();
  auth2
    .signOut()
    .then(function () {
      localStorage.removeItem('token');
      // console.log('User signed out.');
      $('#isLogin').hide();
      $('#notLogin').show();
      $('#user-info').hide()
      $('#g-signin-button').show()
      $('#signout-button').hide()
      $('#currentUser').html('');
    })
    .catch(function (err) {
      console.error(err);
    });
}

function searchMovies() {
  $('#movie--section .spinner').show();
  $('#movie-list').empty();
  let title = $('#search-input').val();
  if (!title) {
    Swal.fire(
      'Hey, what are you looking?',
      'Please input movie title',
      'question'
    );
  } else {
    // console.log(title);
    $.ajax({
      method: 'post',
      url: 'http://localhost:3000/tmdb/movies/search',
      data: {
        title
      }
    })
      .done(response => {
        $('#movie--section .spinner').hide();
        if (!response.total_results) {
          $('#movie-list').html(`
          <div class="col">
            <h1 class="text-center">Movie Not Found!</h1>
          </div>
          `);
        } else {
          $('#popular').hide();
          $('#movie-list').empty();
          let movies = response['results'];
          // console.log(movies);
          $.each(movies, (idx, movie) => {
            if (movie.poster_path) {
              $('#movie-list').append(`
              <div class="col-md-4">
                <div class="card mb-3">
                  <img src="http://image.tmdb.org/t/p/w342/${movie.poster_path}" class="card-img-top">
                  <div class="card-body">
                    <h5 class="card-title">${movie.title}</h5>
                    <h6 class="card-subtitle mb-2 text-muted">${movie.release_date.slice(0, 4)}</h6>
                    <a href="#" class="card-link see-detail" data-toggle="modal" data-target="#exampleModal" data-id="${movie.id}">See Detail</a>
                  </div>
                </div>
              </div>
              `).hide().fadeIn(400);
            }
          });
          $('#search-input').val('');
        }
      })
      .fail(err => {
        console.log(err);
      });
  }
}

function closeModal() {
  $('.modal-body').html('');
}

function youtubeTrailer(title) {
  $.ajax({
    method: 'get',
    url: 'https://www.googleapis.com/youtube/v3/search',
    data: {
      part: 'snippet',
      maxResults: 1,
      q: title + ' trailer',
      order: 'relevance',
      key: 'AIzaSyBZNJY9BlzCiV8UuaoudKrFeLiHUmdgRvU'
    }
  })
    .done(response => {
      // console.log(response);
      let videoId = response['items'][0]['id']['videoId'];
      $('#trailer').append(`
        <iframe src="https://youtube.com/embed/${videoId}?rel=0" frameborder="0" width="100%" height="450"></iframe>
      `);
    })
    .fail(err => {
      console.log(err);
    });
}

function getActor(id, cb) {
  $.ajax({
    method: 'post',
    url: 'http://localhost:3000/tmdb/actor/',
    data: {
      movieId: id
    }
  })
    .done(response => {
      let actor = response['cast'][0].name;
      // console.log(actor);
      cb(actor);
    })
    .fail(err => {
      console.log(err)
    });
}

function movieQuotes(actorName) {
  $.ajax({
    method: 'get',
    url: `http://localhost:3000/quotes/qlist/?filter=${actorName}&type=author`,

  })
    .done(quote => {
      // console.log(quote ,'=========>')
      let payload = quote['data']['quotes'][Math.round(Math.random() * quote['data']['quotes'].length)];
      // console.log(payload);
      let random = Math.floor()
      $('#movie-q').append(`
      <ul class="list-group">
        <li class="list-group-item"><span><i>${payload.body}</i> - <strong>${payload.author}</strong></span></li>
      </ul>
      `)
    })
    .fail(err => {
      console.log(err)
    })
}


$('#movie-list').on('click', '.see-detail', function () {
  // console.log($(this).data('id'));
  let id = $(this).data('id');
  console.log(id);
  $.ajax({
    method: 'get',
    url: `https://api.themoviedb.org/3/movie/${id}`,
    data: {
      api_key: '0804521c190ce53999a10379aabf2c60'
    }
  })
    .done(movie => {

      youtubeTrailer(movie.original_title);
      getActor(movie.id, function (data) {
        movieQuotes(data);
      });
      $('.modal-body').html(`
        <div class="container-fluid">
          <div class="row">
            <div class="col-md-4">
              <img src="http://image.tmdb.org/t/p/w342/${movie.poster_path}" class="img-fluid">
              <div id="movie-q"></div>
            </div>
            <div class="col-md-8">
              <ul class="list-group">
                <li class="list-group-item"><h3>${movie.title}</h3></li>
                <li class="list-group-item"><strong>Original title</strong> : ${movie.original_title}</li>
                <li class="list-group-item"><strong>Rating</strong> : ${movie.vote_average}</li>
                <li class="list-group-item"><strong>Description</strong> : <br><br> ${movie.overview}</li>
              </ul>
            </div>
          </div>
          <h5 class="my-4"><strong>Trailer<strong></h5>
          <div id="trailer"></div>
          <h5 class="my-4"><strong>Comments<strong></h5>
          <input type="text" id="enterSomething"><br><br>
          <div id="commentSection"></div>
        </div>
      `)
      getComments(movie.id)
      $('#enterSomething').keyup(function (e) {
        var code = e.which
        if (code === 13) {
          e.preventDefault()
        }
        if (code === 13) {
          addComment($('#currentUser a')[0].innerHTML, movie.id, $('#enterSomething').val())
        }
      })
    })
    .fail(err => {
      console.log(err);
    });
});

function getComments(id) {
  $.ajax({
    method: 'get',
    url: `http://localhost:3000/users/comment/${id}`
  })
    .done(comments => {
      comments.reverse()
      let html = ``
      comments.forEach(comment => {
        html += `<p>${comment.name}: ${comment.comment}</p>`
      })
      $('#commentSection').append(html)
    })
    .fail(err => {
      console.log(err)
    })
}

function addComment(name, movieId, comment) {
  $.ajax({
    method: 'post',
    url: `http://localhost:3000/users/comment`,
    data: {
      name,
      movieId,
      comment
    }
  })
    .done(result => {
      let html = `<p>${result.name}: ${result.comment}</p>`
      $('#commentSection').prepend(html)
    })
    .fail(err => {
      console.log(err)
    })
}