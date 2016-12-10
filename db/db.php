<?php

require_once('config.php');

class ProjectDatabase {

    function connect() {
        $connection = new MySQLi(db_address, db_user, db_password, db_name);
        if($connection->connect_errno)
        {
            die("ERROR : -> ".$connection->connect_error);
        }
        return $connection;
    }

    public function create($values) {
        $query = 'INSERT INTO projects VALUES ('.join($values, ', ').')';
        var_dump($query);
        $result = $this->connect()->query($query);
        return $result;
    }

    public function update($id, $values) {
        $query = 'UPDATE projects SET ';
        foreach ($values as $key => $value) {
            $query = $query."$key=$value";
        }
        $query = $query.'WHERE id='.$id;
    }

    public function delete($id) {
        $query = "DELETE FROM projects WHERE id=$id";
    }

    public function select($criteria) {
        $query = 'SELECT * FROM projects';
        if (count($criteria) > 0) {
            $query = $query.' WHERE ';
            $iterator = new ArrayIterator($criteria);
            $query = $query.($iterator->key()).'='.($iterator->current());
            $iterator->next();
            while($iterator->valid()) {
                $query = $query.' AND '.($iterator->key()).'='($iterator->current());
                $iterator->next();
            }
        }
        // var_dump($query);
        $result = $this->connect()->query($query);
        return $result;
    }

}

?>