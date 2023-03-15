// Client facing scripts here
function readSearchInput() {
  let searchbar = $("#searchbar").val();

  if (searchbar.val() > 0) {
      $.post("ajax/search.php", {
          searchbar: searchbar
      }, function (data, status) {
      $(".records_content").html(data);
      });
  } else {
      $.get("ajax/readRecords.php", {}, function (data, status) {
      $(".records_content").html(data);
      });
  }
};
