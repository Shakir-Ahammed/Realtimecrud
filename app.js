$(document).ready(function () {
  $("#addEmployeeButton").click(function () {
    // Get form input values
    const name = $("#name").val();
    const officeId = $("#officeId").val();
    const email = $("#email").val();
    const designation = $("#designation").val();
    const image = $("#image")[0].files[0];

    // Check if all fields are filled up
    if (
      name === "" ||
      officeId === "" ||
      email === "" ||
      designation === "" ||
      !image
    ) {
      alert("Please fill up all fields.");
      return;
    }

    // Check if email is valid
    if (!isValidEmail(email)) {
      $("#email").addClass("is-invalid");
      $("#email")
        .next(".invalid-feedback")
        .html("Please enter a valid email address.");
      return;
    } else {
      $("#email").removeClass("is-invalid");
      $("#email").next(".invalid-feedback").html("");
    }

    // Check if image is valid
    if (image && !isValidImage(image)) {
      $("#image").addClass("is-invalid");
      $("#image")
        .next(".invalid-feedback")
        .html("Please upload a valid image file.");
      return;
    } else {
      $("#image").removeClass("is-invalid");
      $("#image").next(".invalid-feedback").html("");
    }

    // Other validation code goes here

    // Submit form via AJAX
    $.ajax({
      url: "submit.php",
      type: "POST",
      data: new FormData($("#addEmployeeForm")[0]),
      processData: false,
      contentType: false,
      success: function (response) {
        console.log("Form submitted successfully");
        $("#addEmployeeModal").modal("hide"); // Hide the modal
        $("#addEmployeeForm")[0].reset(); // Reset the form
        // Add code here to update the table or display a success message
      },
      error: function (xhr, status, error) {
        console.log("Form submission failed: " + error);
        // Add code here to display an error message
      },
    });
  });
});

function isValidEmail(email) {
  // Regular expression to match email addresses
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Test the email address against the regular expression
  return emailRegex.test(email);
}

function isValidImage(image) {
  // Check if file type is image
  return /^image\//.test(image.type);
}

// Delete employee via AJAX
function deleteEmployee(id) {
  // Confirm the deletion
  if (confirm("Are you sure you want to delete this employee?")) {
    // Submit AJAX request to delete employee
    $.ajax({
      url: "delete.php",
      type: "POST",
      data: { id: id },
      success: function (response) {
        console.log("Employee deleted successfully");
        // Remove the deleted row from the table
        $("#employeeTable tbody tr[data-id='" + id + "']").remove();
      },
      error: function (xhr, status, error) {
        console.log("Error deleting employee: " + error);
      },
    });
  }
}

// Fetch employee data via AJAX
function getEmployees() {
  $.ajax({
    url: "getdata.php",
    type: "GET",
    dataType: "json",
    success: function (data) {
      // Clear the table
      $("#employeeTable tbody").empty();

      // Loop through the data and add each row to the table
      $.each(data, function (index, employee) {
        $("#employeeTable tbody").append(
          "<tr data-id='" +
            employee.id +
            "'>" +
            "<td>" +
            (index + 1) +
            "</td>" +
            "<td class='employee-name'>" +
            employee.name +
            "</td>" +
            "<td class='office-id'>" +
            employee.office_id +
            "</td>" +
            "<td class='employee-email'>" +
            employee.email +
            "</td>" +
            "<td class='employee-designation'>" +
            employee.di +
            "</td>" +
            "<td><img src='" +
            employee.img +
            "' width='50' height='50'></td>" +
            "<td>" +
            "<button type='button' class='btn btn-primary mr-2 edit-btn' data-toggle='modal' data-target='#editEmployeeModal' data-id='" +
            employee.id +
            "'>Edit</button>" +
            "<button type='button' class='btn btn-danger' onclick='deleteEmployee(" +
            employee.id +
            ")'>Delete</button>" +
            "</td>" +
            "</tr>"
        );
      });
    },
    error: function (xhr, status, error) {
      console.log("Error fetching employee data: " + error);
    },
  });
}

$(document).ready(function () {
  // Load initial data on page load
  getEmployees();

  // Reload data every 1 seconds
  setInterval(getEmployees, 1000);
});

// Add event listener to Edit form submission
// Add event listener to Edit button
$("#employeeTable").on("click", ".edit-btn", function () {
  // Get employee ID

  const employeeId = $(this).data("id");

  // Send AJAX request to get employee data
  $.ajax({
    url: "getemp.php",
    type: "GET",
    data: { id: employeeId },
    success: function (response) {
      const employeeData = JSON.parse(response);
      console.log("Employee data fetched:", employeeData);
      // Populate form fields with employee data
      $("#editEmployeeForm #name").val(employeeData.name);
      $("#editEmployeeForm #officeId").val(employeeData.office_id);
      $("#editEmployeeForm #email").val(employeeData.email);
      $("#editEmployeeForm #designation").val(employeeData.di);
      $("#editEmployeeForm #employeeId").val(employeeData.id);

      // Set the correct base path for the image URL
      const basePath =
        location.protocol + "//" + location.host + location.pathname;
      const imageUrl = basePath + employeeData.img;

      $("#editEmployeeForm #existingImage").attr("src", imageUrl);
    },
    error: function (xhr, status, error) {
      console.log("Error fetching employee data: " + error);
    },
  });
});

// Add event listener to Edit form submission
// Add event listener to Edit form submission
// Add event listener to Edit form submission
$("#editEmployeeForm").submit(function (event) {
  event.preventDefault();

  // Get form input values
  const name = $("#editEmployeeForm #name").val();
  const officeId = $("#editEmployeeForm #officeId").val();
  const email = $("#editEmployeeForm #email").val();
  const designation = $("#editEmployeeForm #designation").val();
  const employeeId = $("#editEmployeeForm #employeeId").val();
  const image = $("#editEmployeeForm #image")[0].files[0];

  // Create form data object
  const formData = new FormData();
  formData.append("_method", "PUT");
  formData.append("id", employeeId);
  formData.append("name", name);
  formData.append("office_id", officeId);
  formData.append("email", email);
  formData.append("designation", designation);
  if (image) {
    formData.append("image", image);
  }

  // Send AJAX request to update employee data
  $.ajax({
    url: "edit.php",
    method: "POST",
    data: formData,
    processData: false,
    contentType: false,

    success: function () {
      // Update table with new data
      const tableRow = $("#employeeTable")
        .find(`[data-id='${employeeId}']`)
        .closest("tr");
      tableRow.find(".employee-name").text(name);
      tableRow.find(".office-id").text(officeId);
      tableRow.find(".employee-email").text(email);
      tableRow.find(".employee-designation").text(designation);

      // Close modal
      $("#editEmployeeModal").modal("hide");
    },
    error: function (xhr, status, error) {
      console.log("Error updating employee data: " + error);
    },
  });
});
