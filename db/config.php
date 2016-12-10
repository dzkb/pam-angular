<?php
// database config
define('db_address', 'localhost');
define('db_user', 'root');
define('db_password', '');
define('db_name', 'pam');

// toggle debug
define('print_queries', false);

// key names mapped to types
define('type_schema', array(
    'id'                => 'int',
    'projectName'       => 'str',
    'keywords'          => 'str',
    'completionYear'    => 'int',
    'location'          => 'str',
    'projectType'       => 'str',
    'contractor'        => 'str',
    'architect'         => 'str',
    'buildingType'      => 'str',
    'buildingStyle'     => 'str',
    'totalArea'         => 'int',
    'price'             => 'int',
    'mainImage'         => 'str',
    'images'            => 'str'
    ));
?>