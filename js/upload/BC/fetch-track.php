<?php
	$data = json_decode(file_get_contents('php://input'), true);
	if(empty($data) or empty($data['src'])){
		http_response_code(500);
		exit("Track w/ SRC is required!");
	}
	
	$track = array();
	$doc = new DOMDocument();
	libxml_use_internal_errors(true);
	$doc->loadHTMLFile($data['src'],LIBXML_COMPACT);
	libxml_clear_errors();
	$h1 = $doc->getElementsByTagName("script");
	foreach ($h1 as $h) {
		if($h->getAttribute('type') == "application/ld+json"){
			$obj = json_decode($h->nodeValue,true);
			$track['src'] = $obj['@id'];
			$track['artist'] = $obj['byArtist']['name'];
			$track['artwork_url'] = $obj['image'];
			$track['title'] = $obj['name'];
			$track['duration'] = $obj['additionalProperty'][2]['value'];
			$track['filetype'] = "BC";
			//$track['obj'] = $obj;
		}
	}
	echo json_encode($track);
	
?>
