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
  $(".fa-heart").click(function() {
    console.log(this.id);
    $.ajax({
      method: "POST",
      url: `/api/resources/${this.id}/likes`
    }).done();
  });
});
