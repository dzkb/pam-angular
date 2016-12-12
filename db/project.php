<?php
/*
    RESTful API v1

    Usage:
    GET /projects
        - retrieves every project data,
          returns JSON array with projects
    GET /projects/<id>
        - retrieves single project data,
          returns JSON object
    POST /projects
        - creates a project from POST data
    PUT /projects/<id>
        - modifies project with given id,
          uses data from request body
    DELETE /projects/<id>
        - deletes project with given id


*/

require_once('db.php');
$db = new ProjectDatabase();

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $db->create($_REQUEST);
    if ($db->affected_count > 0) {
        print(json_encode(['error' => 'SUCCESS']));
    }else{
        print(json_encode(['error' => 'could not insert data',
                           'mysqli_error' => $db->error]));
    }
} elseif ($_SERVER['REQUEST_METHOD'] == 'PUT') {
    parse_str(file_get_contents("php://input"),$post_vars);
    $db->update($post_vars['id'], $post_vars);
    if ($db->affected_count > 0) {
        print(json_encode(['error' => 'SUCCESS']));
    }else{
        print(json_encode(['error' => 'could not update data',
                           'mysqli_error' => $db->error]));
    }
} elseif ($_SERVER['REQUEST_METHOD'] == 'GET') {
    if (!array_key_exists('id', $_GET)) {
        $sel = $db->select([]);
        $result = [];
        foreach($sel as $v) {
            $result[] = $v;
        }
        if (count($result) > 0) {
            print(json_encode($result));
        } else {
            print(json_encode(['error' => 'no data returned']));
        }
    }else{
        $project = $db->select(['id' => $_GET['id']])->fetch_assoc();
        if ($project) {
            print(json_encode($project));
        } else {
            print(json_encode(['error' => 'no data returned']));
        }
    }
} elseif ($_SERVER['REQUEST_METHOD'] == 'DELETE') {
    // parse_str(file_get_contents("php://input"),$post_vars);
    // $result = $db->delete($post_vars['id']);
    $result = $db->delete($_GET['id']);
    if ($db->affected_count > 0) {
        print(json_encode(['error' => 'SUCCESS']));
    }else{
        print(json_encode(['error' => 'could not delete data',
                           'mysqli_error' => $db->error]));
    }
}