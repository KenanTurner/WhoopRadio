<?php
	$data = json_decode(file_get_contents('php://input'), true);
	$url = $data["url"];
	if(empty($url)){
		http_response_code(500);
		exit("URL is required!");
	}
	$track = array();
	
	$doc = new DOMDocument();
	$doc->loadHTMLFile($url,LIBXML_COMPACT);
	
	$div = $doc->getElementById('EchoTopic');
	$track['title'] = $div->childNodes[12]->lastChild->textContent;
	$items = $div->getElementsByTagName('audio');
	foreach ($items as $item) {
		$track['src'] = $item->getAttribute('src');
	}
	$track['filetype'] = "VGM";
	
	echo json_encode($track);
?>

