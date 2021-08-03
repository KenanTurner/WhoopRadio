<?php
	$data = json_decode(file_get_contents('php://input'), true);
	$url = $data["url"];
	if(empty($url)){
		http_response_code(500);
		exit("URL is required!");
	}
	echo json_encode($data);
?>
