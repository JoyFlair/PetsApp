<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: http://localhost:3000"); // Update the origin to match your frontend
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

// Handle OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$servername = "localhost";
$dbusername = "root";
$dbpassword = "";
$dbname = "dbpets";

$mysqli = new mysqli($servername, $dbusername, $dbpassword, $dbname);

if ($mysqli->connect_error) {
    die(json_encode(['error' => 'Connect Error (' . $mysqli->connect_errno . ') ' . $mysqli->connect_error]));
}

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $result = $mysqli->query('SELECT * FROM Owners');
        if ($result) {
            $owners = $result->fetch_all(MYSQLI_ASSOC);
            echo json_encode($owners);
        } else {
            echo json_encode(['error' => 'Failed to fetch owners']);
        }
        break;

    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        $name = $data['name'] ?? '';
        $contactDetails = $data['contactDetails'] ?? '';
        $address = $data['address'] ?? '';

        if ($name && $contactDetails && $address) {
            $stmt = $mysqli->prepare('INSERT INTO Owners (OwnerName, ContactDetails, Address) VALUES (?, ?, ?)');
            if ($stmt) {
                $stmt->bind_param('sss', $name, $contactDetails, $address);

                if ($stmt->execute()) {
                    echo json_encode(['message' => 'Owner added']);
                } else {
                    echo json_encode(['error' => 'Failed to add owner: ' . $stmt->error]);
                }

                $stmt->close();
            } else {
                echo json_encode(['error' => 'Prepare failed: ' . $mysqli->error]);
            }
        } else {
            echo json_encode(['error' => 'Invalid input']);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        break;
}

$mysqli->close();
?>
