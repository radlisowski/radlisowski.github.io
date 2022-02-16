
const loginForm = document.getElementById("login-form");

const successMessage = document.getElementById("success-message");
const errorMessage = document.getElementById("error-message");
const successButton = document.getElementById("success-button");
const errorButton = document.getElementById("error-button");

const loginButton = document.getElementById("signin-button");
const username = "testUsername";
const password = "testPassword";

loginButton.addEventListener("click", function () {
    let enteredUsername = document.getElementById("username-field").value;
    let enterPassword = document.getElementById("password-field").value;


    if (enterPassword == password && enteredUsername == username) {
        successMessage.style.display = "block";
        successButton.style.display = "block";
        loginForm.style.display = "none";
    } else {
        errorMessage.style.display = "block";
        errorButton.style.display = "block";
        loginForm.style.display = "none";
    }
});

errorMessage.addEventListener("click", function () {
    location.reload();
});

successMessage.addEventListener("click", function () {
    location.reload();
});