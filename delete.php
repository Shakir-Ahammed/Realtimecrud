<?php

// Connect to the database
$conn = mysqli_connect("localhost", "root", "", "test");

// Check connection
if (!$conn) {
  die("Connection failed: " . mysqli_connect_error());
}

// Check if id parameter is present in POST data
if (isset($_POST["id"])) {
  
  // Escape user input to avoid SQL injection
  $id = mysqli_real_escape_string($conn, $_POST["id"]);
  
  // SQL statement to delete data
  $sql = "DELETE FROM emp WHERE id = $id";
  
  if (mysqli_query($conn, $sql)) {
    echo "Record deleted successfully";
  } else {
    echo "Error deleting record: " . mysqli_error($conn);
  }
  
} else {
  echo "No id parameter found";
}

// Close database connection
mysqli_close($conn);
