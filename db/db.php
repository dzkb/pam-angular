<?php

require_once('config.php');

class ProjectDatabase {

    public $affected_count = 0;
    public $error = '';

    function connect() {
        $connection = new MySQLi(db_address, db_user, db_password, db_name);
        if($connection->connect_errno)
        {
            die("ERROR : -> ".$connection->connect_error);
        }
        return $connection;
    }

    public function create($values) {
        $connection = $this->connect();
        $values = $this->rewrite_types($values);

        $query = 'INSERT INTO projects('.join(array_keys($values), ', ').') VALUES ('.join(array_values($values), ', ').')';
        if (print_queries)
            var_dump($query);
        $result = $connection->query($query);
        $this->affected_count = $connection->affected_rows;
        $this->error = $connection->error;
        return $result;
    }

    public function update($id, $values) {
        $connection = $this->connect();
        $query = 'UPDATE projects SET ';

        $values = $this->rewrite_types($values);

        $iterator = new ArrayIterator($values);
        $query = $query.($iterator->key()).'='.($iterator->current());
        $iterator->next();

        while ($iterator->valid()) {
            $query = $query.', '.($iterator->key()).'='.($iterator->current());
            $iterator->next();
        }
        $query = $query.' WHERE id='.$id;
        if (print_queries)
            var_dump($query);
        $result = $connection->query($query);
        $this->affected_count = $connection->affected_rows;
        $this->error = $connection->error;
        return $result;
    }

    public function delete($id) {
        $connection = $this->connect();
        $query = "DELETE FROM projects WHERE id=$id";
        if (print_queries)
            var_dump($query);
        $result = $connection->query($query);
        $this->affected_count = $connection->affected_rows;
        $this->error = $connection->error;
        return $result;
    }

    public function select($criteria) {
        $connection = $this->connect();
        $query = 'SELECT * FROM projects';
        if (count($criteria) > 0) {
            $criteria = $this->rewrite_types($criteria);
            $query = $query.' WHERE ';
            $iterator = new ArrayIterator($criteria);
            $query = $query.($iterator->key()).'='.($iterator->current());
            $iterator->next();
            while($iterator->valid()) {
                $query = $query.' AND '.($iterator->key()).'='.($iterator->current());
                $iterator->next();
            }
        }
        if (print_queries)
            var_dump($query);
        $result = $connection->query($query);
        $this->error = $connection->error;
        return $result;
    }

    // prepare values to match MySQL data types
    private function rewrite_types($array) {
        $iterator = new ArrayIterator($array);
        while ($iterator->valid()) {
            if (key_exists($iterator->key(), type_schema)) {
                if (type_schema[$iterator->key()] == 'str') {
                    $array[$iterator->key()] = "'".$iterator->current()."'";
                }elseif (type_schema[$iterator->key()] == 'json') {
                    $array[$iterator->key()] = "'".json_encode($iterator->current())."'";
                }
            }
            $iterator->next();
        }
        return $array;
    }

}

?>