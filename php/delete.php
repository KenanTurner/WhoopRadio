<?php
    $album = json_decode(file_get_contents('php://input'), true);
    if(empty($album)){
		http_response_code(500);
		exit("Album is required!");
    }
    $dir = "../metadata/";
	
    $file = preg_replace("/([^\w\s\d\-_~,;\[\]\(\).])/", '', $album['title']);
    $file = preg_replace("/([\.]{2,})/", '', $file);
    unlink($dir.$file.'.json');
	echo file_get_contents('php://input');
?>

