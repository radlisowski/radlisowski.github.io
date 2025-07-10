
const loginForm = document.getElementById("login-form");
const errorMessage = document.getElementById("error-message");
const errorButton = document.getElementById("error-button");
const loginButton = document.getElementById("signin-button");

window.onload = function() {
    document.getElementById("username-field").focus();
  };

loginButton.addEventListener("mouseover", function (){
    loginButton.style.transform = "scale(1.07)";
})

loginButton.addEventListener("mouseout", function () {
    loginButton.style.transform = "scale(1)";
})

loginButton.addEventListener("click", async function () {
    let enteredUsername = document.getElementById("username-field").value;
    let enterPassword = document.getElementById("password-field").value;

    const apiURL = "https://api-project-yrxg.onrender.com/users/check";
try {
      const response = await fetch(apiURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "username": enteredUsername,
          "password": enterPassword
        })
      });

      if (response.ok) {
        const data = response.json();
        errorMessage.style.display = "none";
        window.location.href = "index.html";
        // Optionally: redirect or store token here
      } else {
        errorMessage.style.display = "block";
          errorButton.style.display = "block";
          loginForm.style.display = "none";
      }
    } catch (err) {
      console.error("Login error:", err);
      errorMessage.style.display = "block";
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
