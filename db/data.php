<?php
/* 
    
*/

require_once('db.php');

const SCHEMA = ['projectName' => 'str',
                'keywords' => 'str',
                'completionYear' =>'int',
                'location' => 'str',
                'projectType' => 'str',
                'contractor' => 'str',
                'architect' => 'str',
                'buildingType' => 'str',
                'buildingStyle' => 'str',
                'totalArea' =>'int',
                'price' =>'int',
                'mainImage' => 'str',
                'images' => 'str'];

$db = new ProjectDatabase();

// $project = [
// '1', 
// '\'Green2Day\'',
// '\'office green day\'', 
// '2017', 
// '\'Wrocław\'', 
// '\'implementation\'', 
// '\'Skanska\'', 
// '\'Maćków Pracownia Projektowa Sp. Z O.O\'', 
// '\'office\'', 
// '\'modern\'', 
// '17000', 
// '3000000', 
// '\'http://placehold.it/64x64\'', 
// '\'["http://placehold.it/900x300","http://placehold.it/900x300","http://placehold.it/900x300"]\''
// ];

$sel = $db->select([]);
// var_dump($sel);
$result = [];
foreach($sel as $v) {
    $result[] = $v;
}

print(json_encode($result));

// var_dump($db->create($project));
?>