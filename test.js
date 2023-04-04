$(document).ready(function () {
  $("#myForm").on("click", function (event) {
    event.preventDefault();

    $.ajax({
      type: "POST",
      url: "submit.php",
      success: function (response) {
        console.log(response); // log the response from the server
        // Add code here to update the page or display a success message
      },
      error: function (xhr, status, error) {
        console.log(error); // log any errors
        // Add code here to display an error message
      },
    });
  });
});
