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
    if ($(this).hasClass("not-liked")) {
      $.ajax({
        method: "POST",
        url: `/api/resources/${this.id}/likes`
      }).done(data => {
        $(`#${this.id}`)
          .siblings()
          .text(data.number_of_likes);
        $(`#${this.id}`)
          .removeClass("not-liked")
          .addClass("liked");
      });
    } else if ($(this).hasClass("liked")) {
      $.ajax({
        method: "POST",
        url: `/api/resources/${this.id}/likes/delete`
      }).done(data => {
        $(`#${this.id}`)
          .siblings()
          .text(data.number_of_likes);
        $(`#${this.id}`)
          .removeClass("liked")
          .addClass("not-liked");
      });
    }
  });
  //ratings function
  $(".fa-star").click(function() {
    const resource_id = $(this)
      .parent()
      .attr("for")
      .split("_")[1];

    console.log(resource_id);

    const rating = $(this)
      .parent()
      .attr("for")
      .split("-")[1][0];

    $.ajax({
      method: "POST",
      url: `/api/resources/${resource_id}/ratings`,
      data: { rating }
    }).done(averageRating => {
      $(`#avg_rating_of_${resource_id}`).text(
        `Avg Rating: ${averageRating.round}`
      );
    });
  });
});
