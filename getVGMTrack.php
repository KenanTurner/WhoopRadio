<?php
	//$url = "https://downloads.khinsider.com/game-soundtracks/album/legend-of-zelda-the-30th-anniversary-concert";
	//$url = '/game-soundtracks/album/howls-moving-castle-original-soundtrack/01%2520-opening-%2520merry-go-round%2520of%2520life.mp3';
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
	
	$data = getSrc("https://downloads.khinsider.com".$url);
	echo json_encode($data,JSON_UNESCAPED_SLASHES);
	
?>
