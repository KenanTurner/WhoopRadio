<?php
	//$url = "https://downloads.khinsider.com/game-soundtracks/album/legend-of-zelda-the-30th-anniversary-concert";
	//$url = "https://downloads.khinsider.com/game-soundtracks/album/princess-mononoke-soundtrack";
	$url = $_POST["href"];

	$doc = new DOMDocument();
	$doc->loadHTMLFile($url,LIBXML_COMPACT);
	$links = $doc->getElementsByTagName("a");
	$data = array();
	$data2 = array();
	foreach ($links as $link) {
		//print_r($link);
		if (strpos($link->nodeValue, 'get_app') !== false) {
			$a = array();
			$a[0] = $link->getAttribute('href');
			array_push($data,$a);
		}
	}
	foreach ($data as &$a) {
		foreach ($links as $link) {
			if (strpos($link->getAttribute('href'), $a[0]) !== false) {
				$a[1] = $link->textContent;
				str_replace("&#8203;", "", $a[1]);
				$a[1] = preg_replace( '/[\x{200B}-\x{200D}]/u', ' ', $a[1]);
				break;
			}
		}
	}
	echo stripslashes(json_encode($data));
	
?>
