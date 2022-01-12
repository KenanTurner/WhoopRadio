<?php
	$data = json_decode(file_get_contents('php://input'), true);
	if(empty($data) or empty($data['src'])){
		http_response_code(500);
		exit("Album w/ SRC is required!");
	}
	
	$album = array();
	$album['src'] = $data['src'];
	$album['tracks'] = array();
	
	$doc = new DOMDocument();
	libxml_use_internal_errors(true);
	$doc->loadHTMLFile($data['src'],LIBXML_COMPACT);
	libxml_clear_errors();
	
	$h1 = $doc->getElementsByTagName("script");
	foreach ($h1 as $h) {
		if($h->getAttribute('type') == "application/ld+json"){
			$obj = json_decode($h->nodeValue,true);
			$album['title'] = $obj["name"];
			$album['src'] = $obj["@id"];
			$album['artist'] = $obj['byArtist']['name'];
			$album['artwork_url'] = $obj['image'];
			foreach ($obj['track']['itemListElement'] as $item) {
				$track = array();
				$track['src'] = $item['item']['@id'];
				$track['title'] = $item['item']['name'];
				$track['duration'] = $item['item']['additionalProperty'][1]['value'];
				$track['filetype'] = "BC";
				array_push($album['tracks'],$track);
			}
			//$test['obj'] = $obj;
		}
	}
	echo json_encode($album);
	
?>
