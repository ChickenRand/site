"use strict";

$(function() {
  $("#diff_ones_fountain").before(
    '<div id="loader"><img src="/images/ajax-loader.gif">  Fetching results...</div>'
  );

  $.get("/admin/get_raw_results_fountain.json", function(data) {
    if (data.length > 0) {
      createCumulativeGraph("#diff_ones_fountain", data);
      $("#loader").remove();
    } else {
      $("#diff_ones_fountain").remove();
      $("#loader").html("No results.");
    }
  });
});
