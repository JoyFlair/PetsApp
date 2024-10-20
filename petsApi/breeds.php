<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");
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
        $result = $mysqli->query('SELECT * FROM Breeds');
        if ($result) {
            $breeds = $result->fetch_all(MYSQLI_ASSOC);
            echo json_encode($breeds);
        } else {
            echo json_encode(['error' => 'Failed to fetch breeds']);
        }
        break;

        case 'POST':
            $data = json_decode(file_get_contents('php://input'), true);
            if ($data) {
                $name = $data['BreedName'] ?? '';
                $speciesID = $data['SpeciesID'] ?? 0;
        
                // Validate input
                if ($name && $speciesID) {
                    $stmt = $mysqli->prepare('INSERT INTO Breeds (BreedName, SpeciesID) VALUES (?, ?)');
                    $stmt->bind_param('si', $name, $speciesID);
        
                    if ($stmt->execute()) {
                        echo json_encode(['message' => 'Breed added']);
                    } else {
                        echo json_encode(['error' => 'Failed to add breed']);
                    }
        
                    $stmt->close();
                } else {
                    echo json_encode(['error' => 'Invalid input']);
                }
            } else {
                echo json_encode(['error' => 'Failed to decode JSON input']);
            }
            break;
        

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        break;
}

$mysqli->close();
?>
