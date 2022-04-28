<?php
	$data = json_decode(file_get_contents('php://input'), true);
	if(empty($data) or empty($data['src'])){
		http_response_code(500);
		exit("Track w/ src is required!");
	}
	$track = array();
	
	$doc = new DOMDocument();
	libxml_use_internal_errors(true);
	$doc->loadHTMLFile($data['src'],LIBXML_COMPACT);
	libxml_clear_errors();
	
	$div = $doc->getElementById('EchoTopic');
	$track['title'] = $div->childNodes[12]->lastChild->textContent;
	
	$xpath = new DOMXPath($doc);
	$results = $xpath->query("//*[@class='songDownloadLink']/..");
	$track['sources'] = array();
	foreach ($results as $result) {
		//echo $result->getAttribute('href');
		array_push($track['sources'],$result->getAttribute('href'));
		$track['src'] = $result->getAttribute('href');
	}
	
	$track['filetype'] = "HTML";
	
	echo json_encode($track);
?>

