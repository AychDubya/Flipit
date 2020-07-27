// ! Login JS
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
  })
})