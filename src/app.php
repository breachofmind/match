<?php
require DOC_ROOT.'vendor/autoload.php';

/**
 * Return an env var name.
 * @param $key string
 * @return string
 */
function env ($key)
{
    return Dotenv::findEnvironmentVariable($key);
}

/**
 * Include a view.
 * @param $name
 */
function view ($name)
{
    include DOC_ROOT.'assets/views/'.$name.'.php';
}