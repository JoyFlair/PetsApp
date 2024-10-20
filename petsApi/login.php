<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

include 'connection-pdo.php'; // Make sure this file contains the correct PDO connection setup

// Retrieve input data
$username = isset($_POST['username']) ? $_POST['username'] : '';
$password = isset($_POST['password']) ? $_POST['password'] : '';

// Check if inputs are provided
if (empty($username) || empty($password)) {
    echo json_encode(['error' => 'Username and password are required.']);
    exit();
}

// Prepare and execute the SQL query
try {
    $sql = "SELECT password FROM tblusers WHERE username = :username";
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(":username", $username);
    $stmt->execute();

    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    // Check if user exists and verify password
    if ($user && password_verify($password, $user['password'])) {
        echo json_encode(['success' => 'Login successful!']);
    } else {
        echo json_encode(['error' => 'Invalid username or password']);
    }
} catch (PDOException $e) {
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
?>
