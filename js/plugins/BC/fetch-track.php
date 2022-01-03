<?php
	$data = json_decode(file_get_contents('php://input'), true);
	$url = $data["url"];
	if(empty($url)){
		http_response_code(500);
		exit("URL is required!");
	}
	$track = array();
	$track['src'] = $url;
	
	$tags = get_meta_tags($url);
	$track['title'] = $tags["title"];
	
	$doc = new DOMDocument();
	$doc->loadHTMLFile($url,LIBXML_COMPACT);
	$h1 = $doc->getElementsByTagName("script");
	foreach ($h1 as $h) {
		if($h->getAttribute('type') == "application/ld+json"){
			$data = json_decode($h->nodeValue,true);
			$track['src'] = $data['@id'];
			$track['artist'] = $data['byArtist']['name'];
			$track['artwork_url'] = $data['image'];
			$track['title'] = $data['name'];
			$track['duration'] = $data['additionalProperty'][2]['value'];
			$track['filetype'] = "BC";
			//$track['data'] = $data;
		}
	}
	echo json_encode($track);
	
?>
