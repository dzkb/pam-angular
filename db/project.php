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
    // json_decode has to return assoc array instead of object
    $input_data = json_decode(file_get_contents("php://input"), true);
    $db->create($input_data);
    if ($db->affected_count > 0) {
        http_response_code(HTTP_CREATED);
        print(json_encode(['error' => 'SUCCESS']));
    }else{
        http_response_code(HTTP_BAD_REQUEST);
        print(json_encode(['error' => 'could not insert data',
                           'driver_error' => $db->error]));
    }
} elseif ($_SERVER['REQUEST_METHOD'] == 'PUT') {
    $input_data = json_decode(file_get_contents("php://input"), true);
    $db->update($input_data['id'], $input_data);
    if ($db->affected_count > 0) {
        print(json_encode(['error' => 'SUCCESS']));
    }else{
        if ($db->error) {
            http_response_code(HTTP_BAD_REQUEST);
            print(json_encode(['error' => 'could not update data',
                               'driver_error' => $db->error]));
        }else{
            print(json_encode(['error' => 'SUCCESS/NOT_CHANGED']));
        }

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
            // print(json_encode(['error' => 'no data returned']));
            http_response_code(HTTP_NO_CONTENT);
            print(json_encode([]));
        }
    }else{
        $project = $db->select(['id' => $_GET['id']])->fetch_assoc();
        if ($project) {
            print(json_encode($project));
        } else {
            // print(json_encode(['error' => 'no data returned']));
            http_response_code(HTTP_NO_CONTENT);
            print(json_encode([]));
        }
    }
} elseif ($_SERVER['REQUEST_METHOD'] == 'DELETE') {
    // parse_str(file_get_contents("php://input"),$post_vars);
    // $result = $db->delete($post_vars['id']);
    $result = $db->delete($_GET['id']);
    if ($db->affected_count > 0) {
        print(json_encode(['error' => 'SUCCESS']));
    }else{
        http_response_code(HTTP_BAD_REQUEST);
        print(json_encode(['error' => 'could not delete data',
                           'driver_error' => $db->error]));
    }
}