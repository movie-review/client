$(document).ready(function () {
    $('#signout-button').hide();
})

function onSignIn(googleUser) {
    let profile = googleUser.getBasicProfile();
    let id_token = googleUser.getAuthResponse().id_token;
    console.log(id_token);
    console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + profile.getName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.


    $.ajax(
        {
            url: `http://localhost:3000/users/googleSignIn`,
            method: 'POST',
            data: { id_token }
        })
        .done(function (response) {
            console.log("======================");
            // console.log(response);
            localStorage.setItem('token', response.token)

            $('#g-signin-button').hide();
            $('#user-info').show()
            $('#signout-button').show()
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
            console.log('User signed out.');

            $('#user-info').hide()
            $('#g-signin-button').show()
            $('#signout-button').hide()
        })
        .catch(function (err) {
            console.error(err);
        });
}
