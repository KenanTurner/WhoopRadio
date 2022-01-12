<?php
    $album = json_decode(file_get_contents('php://input'), true);
	if(empty($album) or empty($album['title'])){
	    http_response_code(500);
	    exit("Album w/ title is required!");
	}
    $dir = "../metadata/";
    
    //potential encoder
    function base64url_encode($data){
		return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }
	
    //https://stackoverflow.com/a/2021729
    $file = preg_replace("/([^\w\s\d\-_~,;\[\]\(\).])/", '', $album['title']);
    $file = preg_replace("/([\.]{2,})/", '', $file);
    //$file = base64url_encode($file);
    echo file_get_contents($dir.$file.'.json');
?>

