<?php

require_once('config.php');

if (!$_FILES || count($_FILES['uploadedFile']['tmp_name']) == 0) {
    http_response_code(HTTP_BAD_REQUEST);
    die();
}

foreach ($_FILES['uploadedFile']['name'] as $k => $name) {
    $pathinfo = pathinfo($name);
    if (isset($pathinfo['extension'])) {
        if (!in_array($pathinfo['extension'], allowed_extensions)) {
            http_response_code(HTTP_BAD_REQUEST);
            die();
        }
    }
    $uploadfile = dirname(__FILE__) . '/../' . upload_target . basename($name);
    move_uploaded_file($_FILES['uploadedFile']['tmp_name'][$k], $uploadfile);
}

?>