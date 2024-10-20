<?php 
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

class User {
    // login
    function login($json) {
        include "connection-pdo.php";

        $json = json_decode($json, true);
        $username = $json['username'];
        $password = $json['password'];

        $sql = "SELECT * FROM tblusers WHERE usr_username = :username";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':username', $username);
        $stmt->execute();
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user && password_verify($password, $user['usr_password'])) {
            // Login successful
            $response = [
                'status' => 'success',
                'username' => $user['usr_username']
            ];
        } else {
            // Login failed
            $response = [
                'status' => 'error',
                'message' => 'Invalid username or password'
            ];
        }

        unset($conn);
        unset($stmt);
        return json_encode($response);
    }

    // register
    function register($json) {
        include "connection-pdo.php";

        // Implement registration logic
    }

    function setUsers($json) {
        // Implement setUsers logic
    }
}

// Handle requests
if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $operation = $_GET['operation'];
    $json = $_GET['json'];
} elseif ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $operation = $_POST['operation'];
    $json = $_POST['json'];
}

$user = new User();
switch ($operation) {
    case "login":
        echo $user->login($json);
        break;
    case "register":
        echo $user->register($json);
        break;
    case "setUsers":
        echo $user->setUsers($json);
        break;
}
?>
