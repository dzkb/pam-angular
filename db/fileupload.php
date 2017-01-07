<?php

require_once('config.php');

if (!$_FILES || count($_FILES['uploadedFile']['tmp_name']) == 0) {
    http_response_code(HTTP_BAD_REQUEST);
    print(json_encode(['error' => 'uploadedFile[] is a required argument']));
    die();
}

$created_files = [];

foreach ($_FILES['uploadedFile']['name'] as $k => $name) {
    $pathinfo = pathinfo($name);
    if (isset($pathinfo['extension'])) {
        $filename = $pathinfo['filename'] . '_' . uniqid() . '.' . $pathinfo['extension'];
        $uploadfile = dirname(__FILE__) . '/../' . upload_target . $filename;
        if (!in_array(strtolower($pathinfo['extension']), allowed_extensions)) {
            http_response_code(HTTP_BAD_REQUEST);
            print(json_encode(['error' => basename($name) . ' has an unacceptable file extension']));
            die();
        }
    }
    $created_files[] = $filename;
    move_uploaded_file($_FILES['uploadedFile']['tmp_name'][$k], $uploadfile);

}

print(json_encode(['created_files' => $created_files]));

?>