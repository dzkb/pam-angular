<?php
require_once('db.php');
$db = new ProjectDatabase();

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $db->create($_REQUEST);
    if ($db->affected_count > 0) {
        print(json_encode(['error' => 'SUCCESS']));
    }else{
        print(json_encode(['error' => 'COULD_NOT_INSERT_DATA',
                           'mysqli_error' => $db->error]));
    }
} elseif ($_SERVER['REQUEST_METHOD'] == 'PUT') {
    parse_str(file_get_contents("php://input"),$post_vars);
    $db->update($post_vars['id'], $post_vars);
    if ($db->affected_count > 0) {
        print(json_encode(['error' => 'SUCCESS']));
    }else{
        print(json_encode(['error' => 'COULD_NOT_UPDATE_DATA',
                           'mysqli_error' => $db->error]));
    }
} elseif ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $project = $db->select(['id' => $_GET['id']])->fetch_assoc();
    if ($project) {
        print(json_encode($project));
    } else {
        print(json_encode(['error' => 'NO_DATA_RETURNED']));
    }
} elseif ($_SERVER['REQUEST_METHOD'] == 'DELETE') {
    parse_str(file_get_contents("php://input"),$post_vars);
    $result = $db->delete($post_vars['id']);
    if ($db->affected_count > 0) {
        print(json_encode(['error' => 'SUCCESS']));
    }else{
        print(json_encode(['error' => 'COULD_NOT_DELETE_DATA',
                           'mysqli_error' => $db->error]));
    }
}