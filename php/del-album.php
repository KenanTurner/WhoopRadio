<?php
    $album = json_decode(file_get_contents('php://input'), true);
    if(empty($album)){
	http_response_code(500);
	exit("Album is required!");
    }
    $dir = "../data/";
	
    $file = mb_ereg_replace("([^\w\s\d\-_~,;\[\]\(\).])", '', $album['title']);
    $file = mb_ereg_replace("([\.]{2,})", '', $file);
    unlink($dir.$file.'.json');
    echo $album;
?>

