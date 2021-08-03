<?php
	$data = json_decode(file_get_contents('php://input'), true);
	$url = $data["url"];
	if(empty($url)){
		http_response_code(500);
		exit("URL is required!");
	}
	$album = array();
	$album['src'] = $url;
	
	$tags = get_meta_tags($url);
	$album['title'] = $tags["title"];
	
	$album['tracks'] = array();
	$doc = new DOMDocument();
	$doc->loadHTMLFile($url,LIBXML_COMPACT);
	$h1 = $doc->getElementsByTagName("script");
	foreach ($h1 as $h) {
		if($h->getAttribute('type') == "application/ld+json"){
			$data = json_decode($h->nodeValue,true);
			$album['artist'] = $data['byArtist']['name'];
			$album['artwork_url'] = $data['image'];
			foreach ($data['track']['itemListElement'] as $item) {
				$track = array();
				$track['src'] = $item['item']['@id'];
				$track['title'] = $item['item']['name'];
				//$track['src'] = $item['item']['additionalProperty'][2]['value'];
				$track['duration'] = $item['item']['additionalProperty'][1]['value'];
				$track['filetype'] = "BC";
				array_push($album['tracks'],$track);
			}
			//$test['data'] = $data;
		}
	}
	echo json_encode($album);
	
?>
