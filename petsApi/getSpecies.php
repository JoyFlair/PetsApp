<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

class Species {
    function getSpecies(){
        include "connection-pdo.php";
        $sql = "SELECT * FROM species ORDER BY SpeciesName";
        $stmt = $conn->prepare($sql);
        $stmt->execute();
        $returnValue = $stmt->fetchAll(PDO::FETCH_ASSOC);
        unset($conn); 
        unset($stmt);
        return json_encode($returnValue);
    }
}

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $species = new Species();
    $response = $species->getSpecies();
    echo $response;
    exit();
}
