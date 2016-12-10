<?php
require_once('db.php');
$db = new ProjectDatabase();

$sel = $db->select([]);
$result = [];
foreach($sel as $v) {
    $result[] = $v;
}

print(json_encode($result));