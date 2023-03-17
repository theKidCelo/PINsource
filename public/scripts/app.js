// Client facing scripts here
$(() => {
  // $.ajax({
  //   method: "GET",
  //   url: "/api/users"
  // }).done((users) => {
  //   for(user of users) {
  //     $("<div>").text(user.name).appendTo($("body"));
  //   }
  // });
  $("#edit-name").click(function() {
    $(".user-name-input").toggle(400);
  });
  $("#edit-email").click(function() {
    $(".user-email-input").toggle(400);
  });
  $("#edit-password").click(function() {
    $(".user-password-input").toggle(400);
  });

  $(".fa-heart").click(function() {
    $.ajax({
      method: "POST",
      url: `/api/resources/${this.id}/likes`
    }).done(data => {
      $(`#${this.id}`).empty();
      $(`#${this.id}`).text(data.number_of_likes);
    });
  });
});
