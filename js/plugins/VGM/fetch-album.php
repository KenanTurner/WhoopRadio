<?php
	$data = json_decode(file_get_contents('php://input'), true);
	$url = $data["url"];
	if(empty($url)){
		http_response_code(500);
		exit("URL is required!");
	}
	$album = array();
	$album['src'] = $url;
	
	$doc = new DOMDocument();
	$doc->loadHTMLFile($url,LIBXML_COMPACT);
	
	$album['title'] = $doc->getElementById('EchoTopic')->childNodes[5]->textContent;
	
	$album['tracks'] = array();
	$links = $doc->getElementsByTagName("a");
	foreach ($links as $link) {
		if (strpos($link->nodeValue, 'get_app') !== false) {
			array_push($album['tracks'],$link->getAttribute('href'));
		}
	}
	
	echo json_encode($album);
?>

