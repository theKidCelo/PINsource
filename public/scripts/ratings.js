//rating fn
$(() => {
  $(".fa-star").click(function() {
    const resource_id = $(this)
      .parent()
      .attr("for")
      .split("_")[1];

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
