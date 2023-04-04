<?php
// Get the employee ID from the request
$employeeId = $_GET['id'];

$db = new mysqli('localhost', 'root', '', 'test');

if (!$db) {
    die("Connection failed: " . mysqli_connect_error());
}

$sql = "SELECT * FROM emp WHERE id = $employeeId";
$result = mysqli_query($db, $sql);

// Check for errors in the SQL query
if (!$result) {
    echo "Error executing query: " . mysqli_error($db);
    exit;
}

if (mysqli_num_rows($result) > 0) {
    $employeeData = mysqli_fetch_assoc($result);
    echo json_encode($employeeData);
} else {
    echo "No employee found with ID: $employeeId";
}

mysqli_close($db);
