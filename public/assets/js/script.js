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
      alert("Something went wrong");
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

$("#deckSearch").submit(function(event) {
  event.preventDefault();
  const deck = $("#deckInput").val();
  const category = $("#categoryInput").val();
  const user = $("#userId").val();

  location.href = `/search?deck=${deck}&category=${category}&user=${user}`;
})