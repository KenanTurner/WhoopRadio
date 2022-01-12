<?php
    $album = json_decode(file_get_contents('php://input'), true);
	if(empty($album)){
	    http_response_code(500);
	    exit("Album is required!");
	}
    $dir = "../metadata/";
	
    //https://stackoverflow.com/a/2021729
    $file = preg_replace("/([^\w\s\d\-_~,;\[\]\(\).])/", '', $album['title']);
    $file = preg_replace("/([\.]{2,})/", '', $file);
    //$file = base64url_encode($file);
    file_put_contents($dir.$file.'.json',file_get_contents('php://input'));
    chmod($dir.$file.'.json', 0777);
	echo file_get_contents($dir.$file.'.json');
?>

