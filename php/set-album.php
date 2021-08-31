<?php
    $album = json_decode(file_get_contents('php://input'), true);
	if(empty($album)){
	    http_response_code(500);
	    exit("Album is required!");
	}
    $dir = "../metadata/";
    
    //potential encoder
    function base64url_encode($data) {
	return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }
	
    //https://stackoverflow.com/a/2021729
    $file = mb_ereg_replace("([^\w\s\d\-_~,;\[\]\(\).])", '', $album['title']);
    $file = mb_ereg_replace("([\.]{2,})", '', $file);
    //$file = base64url_encode($file);
    file_put_contents($dir.$file.'.json',file_get_contents('php://input'));
    chmod($dir.$file.'.json', 0777);
    echo file_get_contents('php://input');
?>

