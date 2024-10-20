<?php
header('Access-Control-Allow-Origin: http://localhost:3000'); // Allow requests from your client
header('Access-Control-Allow-Methods: POST, GET, OPTIONS'); // Allow specific HTTP methods
header('Access-Control-Allow-Headers: Content-Type'); // Allow specific headers
header('Content-Type: application/json'); // Ensure response is JSON

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit;
}

// Enable error reporting for debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$servername = "localhost";
$dbusername = "root";
$dbpassword = "";
$dbname = "dbpets";

// Create connection
$mysqli = new mysqli($servername, $dbusername, $dbpassword, $dbname);

// Check connection
if ($mysqli->connect_error) {
    die(json_encode(['error' => 'Connection failed: ' . $mysqli->connect_error]));
}

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $result = $mysqli->query('SELECT * FROM Species');
        if ($result) {
            $species = $result->fetch_all(MYSQLI_ASSOC);
            echo json_encode($species);
        } else {
            echo json_encode(['error' => 'Query failed: ' . $mysqli->error]);
        }
        break;

    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        if (isset($data['SpeciesName'])) {
            $name = $data['SpeciesName'];
            $stmt = $mysqli->prepare('INSERT INTO Species (SpeciesName) VALUES (?)');
            if ($stmt) {
                $stmt->bind_param('s', $name);
                if ($stmt->execute()) {
                    echo json_encode(['message' => 'Species added']);
                } else {
                    echo json_encode(['error' => 'Execute failed: ' . $stmt->error]);
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
