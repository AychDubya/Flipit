// ! Login / Logout
$("#loginForm").submit(function(event){
  event.preventDefault();
  const userObj = {
      username: $("#loginUsername").val(),
      password: $("#loginPassword").val()
  }
  $.ajax({
      url:"/login",
      method:"POST",
      data: userObj
  }).done(function(data){
      console.log(data);
      location.href = "/profile"
  }).fail(function(err){
      console.log(err);
      location.reload();
      alert("Incorrect username or password");
  })
})

$("#logout").click(function(event) {
  $.ajax({
    url: "/logout",
    method: "GET",
  }).done(function(data) {
    console.log(data);
  }).fail(function(err) {
    console.log(err);
    location.reload();
  })
})

async function isUsernameTaken(username) {
  return await $.ajax({
    url: `/api/exists/username/${username}`,
    method: "GET",
  })
}

function isValidEmail(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

$("#registerForm").submit(async function(event) {
  event.preventDefault();
  const user = {
    first_name: $("#first_name").val(),
    last_name: $("#last_name").val(),
    email: $("#email").val(),
    username: $("#username").val(),
    password: $("#password").val(),
    rePassword: $("#rePassword").val(),
  }

  const usernameIsTaken = await isUsernameTaken(user.username);

  if (!user.username) {
    alert("Please provide a username.");
  } else if (usernameIsTaken) {
    alert("Username is taken");
  } else if (!user.password) {
    alert("Please provide a password");
  } else if (user.password && !user.rePassword) {
    alert("Please enter your password two times");
  } else if (user.password !== user.rePassword) {
    alert("Passwords do not match.");
  } else if (user.email && !isValidEmail(user.email)) {
    alert("Invalid email address!");
  } else {
    $.ajax({
      url: "/api/users",
      method: "POST",
      data: user,
    }).done(function(data) {
      console.log(data);
      location.reload();
    }).fail(function(err) {
      console.log(err);
      location.reload();
    })
  }
})

// ! Search stuff
$("#deckSearch").submit(function(event) {
  event.preventDefault();
  const deck = $("#deckInput").val();
  const category = $("#categoryInput").val();
  const user = $("#userId").val();

  location.href = `/search?deck=${deck}&category=${category}&user=${user}`;
})

// ! Modal JS
if (location.href.split("/")[3] === "profile") {
  $("#create-deck").click(function(event) {
    $("#newDeck-modal").toggle();
  });
  $(".close").first().click(function(event) {
    $("#newDeck-modal").toggle();
  });
  $(window).click(function(event) {
    if ($(event.target)[0] == $("#newDeck-modal")[0]) {
      $("#newDeck-modal").hide();
    }
  });
}

// ! Create deck
$("#createDeck").submit(function(event) {
  event.preventDefault(event);
  const deck = {
    CreatorId: $("#userId").val(),
    name: $("#deckName").val(),
    CategoryId: $("#deckCategory").val(),
    private: $("#private").is(":checked"),
  }
  console.log(deck);
})
