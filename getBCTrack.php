<?php
	$url = $_POST["href"];
	$album = array();
	$artist = null;
	
	$tags = get_meta_tags($url);
	$album[0] = $tags["title"];
	
	$track = array();
	
	$album[1] = array();
	$doc = new DOMDocument();
	$doc->loadHTMLFile($url,LIBXML_COMPACT);
	$h1 = $doc->getElementsByTagName("script");
	$hrefs = array();
	foreach ($h1 as $h) {
		if($h->getAttribute('type') == "application/ld+json"){
			//echo $h->nodeValue;
			$data = json_decode($h->nodeValue,true);
			//print_r($data);
			$album[0] = $data['name'];
			$artist = $data['byArtist']['name'];
			
			$track[0] = $data['url'];
			$track[1] = $data['name'];
			$track[2] = $artist;
			$track[3] = ceil($data['duration_secs']);
			$track[4] = "BC";
		}
	}
	
	$html = $doc->getElementsByTagName("link");
	$links = array();
	foreach ($html as $link) {
		//echo $link;
		//print_r($link);
		array_push($links,$link->getAttribute('href'));
	}
	//print_r($links);
	$album[2] = "";
    $album[3] = "";
    $album[4] = $links[2];
	
	echo json_encode($track);
	
?>
