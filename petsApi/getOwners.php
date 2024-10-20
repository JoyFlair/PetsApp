<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json"); // Added Content-Type header

class Owners {
    function getOwners(){
        include "connection-pdo.php";
        $sql = "SELECT * FROM owners ORDER BY OwnerID";
        $stmt = $conn->prepare($sql);
        $stmt->execute();
        $returnValue = $stmt->fetchAll(PDO::FETCH_ASSOC);
        unset($conn); 
        unset($stmt);
        return json_encode($returnValue);
    }
}

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $Owners = new Owners(); // Create an instance of the Owners class
    $response = $Owners->getOwners(); // Call the getOwners method on the correct instance
    echo $response;
    exit();
}
