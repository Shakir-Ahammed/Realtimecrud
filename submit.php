<?php
echo "messi";
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Connect to the database
$db = new mysqli("localhost", "root", "", "test");

// Check for errors
if ($db->connect_error) {
    die('Connection failed: ' . $db->connect_error);
} else {
    echo "shuvo";
}

// Get form data
$name = $_POST['name'];
$officeId = $_POST['officeId'];
$email = $_POST['email'];
$designation = $_POST['designation'];

// Store the image file on the server and get the file path
$imagePath = '';
if (isset($_FILES['image']) && $_FILES['image']['error'] == 0) {
    $uploadDir = 'uploads/';
    $imagePath = $uploadDir . basename($_FILES['image']['name']);
    move_uploaded_file($_FILES['image']['tmp_name'], $imagePath);
}

// Insert the data into the database
$sql = "INSERT INTO emp (name, office_id, email, di, img) VALUES (?, ?, ?, ?, ?)";
$stmt = $db->prepare($sql);
$stmt->bind_param('sssss', $name, $officeId, $email, $designation, $imagePath);
if ($stmt->execute()) {
    echo 'Form submitted successfully';
} else {
    echo 'Form submission failed: ' . $stmt->error;
}



// Check if 'action' parameter is set
if (isset($_POST['action'])) {
    $action = $_POST['action'];

    // If action is 'delete'
    if ($action == "delete") {
        // Get employee ID from POST data
        $id = $_POST['id'];

        // Delete the employee from the database
        $sql = "DELETE FROM emp WHERE id = ?";
        $stmt = $db->prepare($sql);
        $stmt->bind_param('i', $id);
        if ($stmt->execute()) {
            echo "Employee deleted successfully";
        } else {
            echo "Employee deletion failed";
        }
        $stmt->close();
    }
}



// Close the database connection
$stmt->close();
$db->close();
