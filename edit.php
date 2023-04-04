<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);



if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['_method']) && $_POST['_method'] == 'PUT') {

    // Read the POST request data
    $employeeId = $_POST['id'];
    $name = $_POST['name'];
    $officeId = $_POST['office_id'];
    $email = $_POST['email'];
    $designation = $_POST['designation'];

    $db = new mysqli('localhost', 'root', '', 'test');

    if (!$db) {
        die("Connection failed: " . mysqli_connect_error());
    }

    // Check if there's a new image file uploaded
    if (isset($_FILES['image']) && $_FILES['image']['size'] > 0) {
        $image = $_FILES['image'];
        $imageName = $image['name'];
        $imageTmpName = $image['tmp_name'];
        $imageSize = $image['size'];
        $imageError = $image['error'];
        $imageType = $image['type'];

        $imageExt = pathinfo($imageName, PATHINFO_EXTENSION);
        $allowed = array('jpg', 'jpeg', 'png', 'gif');

        if (in_array(strtolower($imageExt), $allowed)) {
            if ($imageError === 0) {
                if ($imageSize < 1000000) {
                    $newImageName = uniqid('', true) . '.' . $imageExt;
                    $imageDestination = 'uploads/' . $newImageName;
                    move_uploaded_file($imageTmpName, $imageDestination);
                } else {
                    echo "File size is too large.";
                    exit();
                }
            } else {
                echo "Error uploading the image.";
                exit();
            }
        } else {
            echo "Invalid file type.";
            exit();
        }
    } else {
        $imageDestination = isset($_POST['existingImage']) ? $_POST['existingImage'] : '';
    }

    $sql = "UPDATE emp SET name = ?, office_id = ?, email = ?, di = ?, img = ? WHERE id = ?";
    $stmt = $db->prepare($sql);
    $stmt->bind_param('sssssi', $name, $officeId, $email, $designation, $imageDestination, $employeeId);
    echo "Before executing the statement";
    $result = $stmt->execute();
    echo "After executing the statement";

    if ($result) {
        echo "Employee updated successfully";
    } else {
        echo "Error updating employee: " . $db->error;
    }





    $stmt->close();
    $db->close();
}
