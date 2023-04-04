<?php
// Connect to the database
$db = new mysqli('localhost', 'root', '', 'test');

// Check for errors
if ($db->connect_error) {
    die('Connection failed: ' . $db->connect_error);
}

// Query the database to get the employee data
$sql = "SELECT * FROM emp";
$result = $db->query($sql);

// Create an array to hold the employee data
$employees = array();

// Loop through the result set and add each row to the array
while ($row = $result->fetch_assoc()) {
    $employees[] = $row;
}

// Close the database connection
$db->close();

// Return the employee data as JSON
header('Content-Type: application/json');
echo json_encode($employees);
