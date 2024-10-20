<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

header("Content-Type: application/json; charset=UTF-8");

$servername = "localhost";
$dbusername = "root";
$dbpassword = "";
$dbname = "dbpets";

$mysqli = new mysqli($servername, $dbusername, $dbpassword, $dbname);

if ($mysqli->connect_error) {
    echo json_encode(['error' => 'Connect Error (' . $mysqli->connect_errno . ') ' . $mysqli->connect_error]);
    exit();
}

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        error_log(print_r($data, true)); // Log data for debugging
    
        $Name = $data['Name'] ?? '';
        $SpeciesID = isset($data['SpeciesID']) ? (int)$data['SpeciesID'] : null;
        $BreedID = isset($data['BreedID']) && $data['BreedID'] !== '' ? (int)$data['BreedID'] : null;
        $DateOfBirth = isset($data['DateOfBirth']) ? $data['DateOfBirth'] : '';
        $OwnerID = isset($data['OwnerID']) ? (int)$data['OwnerID'] : null;
    
        // Validate date format
        $DateOfBirth = DateTime::createFromFormat('Y-m-d', $DateOfBirth);
        if ($DateOfBirth) {
            $DateOfBirth = $DateOfBirth->format('Y-m-d');
        } else {
            $DateOfBirth = null;
        }
    
        if (!empty($Name) && $SpeciesID && !empty($DateOfBirth) && $OwnerID) {
            // Check if SpeciesID, BreedID, and OwnerID exist
            $speciesCheck = $mysqli->prepare('SELECT COUNT(*) FROM species WHERE SpeciesID = ?');
            $speciesCheck->bind_param('i', $SpeciesID);
            $speciesCheck->execute();
            $speciesCheck->bind_result($count);
            $speciesCheck->fetch();
            $speciesCheck->close();
    
            if ($count == 0) {
                echo json_encode(['error' => 'Invalid SpeciesID']);
                exit();
            }
    
            if ($BreedID !== null) {
                $breedCheck = $mysqli->prepare('SELECT COUNT(*) FROM breeds WHERE BreedID = ?');
                $breedCheck->bind_param('i', $BreedID);
                $breedCheck->execute();
                $breedCheck->bind_result($count);
                $breedCheck->fetch();
                $breedCheck->close();
    
                if ($count == 0) {
                    echo json_encode(['error' => 'Invalid BreedID']);
                    exit();
                }
            }
    
            $ownerCheck = $mysqli->prepare('SELECT COUNT(*) FROM owners WHERE OwnerID = ?');
            $ownerCheck->bind_param('i', $OwnerID);
            $ownerCheck->execute();
            $ownerCheck->bind_result($count);
            $ownerCheck->fetch();
            $ownerCheck->close();
    
            if ($count == 0) {
                echo json_encode(['error' => 'Invalid OwnerID']);
                exit();
            }
    
            // Insert new pet
            $stmt = $mysqli->prepare('INSERT INTO pets (Name, SpeciesID, BreedID, DateOfBirth, OwnerID) VALUES (?, ?, ?, ?, ?)');
            $stmt->bind_param('sisis', $Name, $SpeciesID, $BreedID, $DateOfBirth, $OwnerID);
            if ($stmt->execute()) {
                echo json_encode(['status' => 1]); // Success
            } else {
                error_log('Failed to add pet: ' . $stmt->error);
                echo json_encode(['status' => 0, 'error' => 'Failed to add pet']);
            }
            
            $stmt->close();
        } else {
            echo json_encode(['error' => 'Invalid input']);
        }
        break;
    

    case 'GET':
        $result = $mysqli->query('SELECT * FROM pets');
        $pets = $result->fetch_all(MYSQLI_ASSOC);
        echo json_encode($pets);
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        break;
}

$mysqli->close();
?>
