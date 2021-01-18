<?php
	//$url = "https://downloads.khinsider.com/game-soundtracks/album/legend-of-zelda-the-30th-anniversary-concert";
	$url = $_POST["href"];
	
	
	function getSrc($url){
		$doc = new DOMDocument();
		$doc->loadHTMLFile($url,LIBXML_COMPACT);
		$links = $doc->getElementsByTagName("a");
		$data = array();
		foreach ($links as $link) {
			//print_r($link);
			//echo $link->nodeValue, PHP_EOL;
			$a = $link->getAttribute('href');
			if (strpos($a, 'https://vgmsite.com/soundtracks/') !== false) {
				//echo $a, PHP_EOL;
				array_push($data,$a);
			}
		}
		return $data;
	}
	
	/*echo getSrc("https://downloads.khinsider.com/game-soundtracks/album/legend-of-zelda-the-30th-anniversary-concert/1-01%2520Hyrule%2520Castle.mp3");
	echo getSrc("https://downloads.khinsider.com/game-soundtracks/album/legend-of-zelda-the-30th-anniversary-concert/1-02%2520Zelda%2527s%2520Theme.mp3");
	echo getSrc("https://downloads.khinsider.com/game-soundtracks/album/legend-of-zelda-the-30th-anniversary-concert/1-03%2520The%2520Wind%2520Waker%2520Medley.mp3");
	* */
	$doc = new DOMDocument();
	$doc->loadHTMLFile($url,LIBXML_COMPACT);
	$links = $doc->getElementsByTagName("a");
	$data = array();
	foreach ($links as $link) {
		//print_r($link);
		if (strpos($link->nodeValue, 'get_app') !== false) {
			$a = $link->getAttribute('href');
			//echo $a, PHP_EOL;
			array_push($data,$a);
		}
	}
	/*foreach ($data as &$href) {
		$href = getSrc("https://downloads.khinsider.com".$href);
	}*/
	echo stripcslashes(json_encode($data));
	
?>
