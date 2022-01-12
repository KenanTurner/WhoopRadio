<?php
	$data = json_decode(file_get_contents('php://input'), true);
	if(empty($data) or empty($data['src'])){
		http_response_code(500);
		exit("Album w/ src is required!");
	}
	
	$album = array();
	$album['src'] = $data['src'];
	
	$doc = new DOMDocument();
	libxml_use_internal_errors(true);
	$doc->loadHTMLFile($data['src'],LIBXML_COMPACT);
	libxml_clear_errors();
	
	$album['title'] = $doc->getElementById('EchoTopic')->childNodes[5]->textContent;
	
	$album['tracks'] = array();
	$links = $doc->getElementsByTagName("a");
	foreach ($links as $link) {
		if (strpos($link->nodeValue, 'get_app') !== false) {
			$track = array();
			$track['src'] = 'https://downloads.khinsider.com'.$link->getAttribute('href');
			array_push($album['tracks'],$track);
		}
	}
	
	echo json_encode($album);
?>

