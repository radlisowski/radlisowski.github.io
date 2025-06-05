
const loginForm = document.getElementById("login-form");
const errorMessage = document.getElementById("error-message");
const errorButton = document.getElementById("error-button");
const loginButton = document.getElementById("signin-button");
const username = "test";
const password = "test";


window.onload = function() {
    document.getElementById("username-field").focus();
  };

loginButton.addEventListener("mouseover", function (){
    loginButton.style.transform = "scale(1.07)";
})

loginButton.addEventListener("mouseout", function () {
    loginButton.style.transform = "scale(1)";
})

loginButton.addEventListener("click", function () {
    let enteredUsername = document.getElementById("username-field").value;
    let enterPassword = document.getElementById("password-field").value;

    if (enterPassword === password && enteredUsername === username) {
        window.location.href = "index.html";
    } else {
        errorMessage.style.display = "block";
        errorButton.style.display = "block";
        loginForm.style.display = "none";
    }
});

document.getElementById("password-field")
    .addEventListener("keyup", function(event) {
    event.preventDefault();
        if (event.key === "Enter") {
            document.getElementById("signin-button").click();
    }
});

errorMessage.addEventListener("click", function () {
    location.reload();
});
