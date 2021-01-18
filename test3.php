<?php
	//$url = "https://downloads.khinsider.com/game-soundtracks/album/legend-of-zelda-the-30th-anniversary-concert";
	//$url = "https://downloads.khinsider.com/game-soundtracks/album/princess-mononoke-soundtrack";
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
	function DOMinnerHTML(DOMNode $element) 
	{ 
		$innerHTML = ""; 
		$children  = $element->childNodes;

		foreach ($children as $child) 
		{ 
			$innerHTML .= $element->ownerDocument->saveHTML($child);
		}

		return $innerHTML; 
	} 
	
	/*echo getSrc("https://downloads.khinsider.com/game-soundtracks/album/legend-of-zelda-the-30th-anniversary-concert/1-01%2520Hyrule%2520Castle.mp3");
	echo getSrc("https://downloads.khinsider.com/game-soundtracks/album/legend-of-zelda-the-30th-anniversary-concert/1-02%2520Zelda%2527s%2520Theme.mp3");
	echo getSrc("https://downloads.khinsider.com/game-soundtracks/album/legend-of-zelda-the-30th-anniversary-concert/1-03%2520The%2520Wind%2520Waker%2520Medley.mp3");
	* */
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
			//->childNodes[6]
			//->childNodes[7]
			//$a = $link->parentNode->parentNode->parentNode->childNodes[3]->nodeValue;
			//echo DOMinnerHTML($link->parentNode->parentNode), PHP_EOL; 
			//echo $link->parentNode->parentNode->childNodes[7]->nodeValue, PHP_EOL;
			//echo $link->parentNode->parentNode->nodeValue, PHP_EOL;
			//echo $a, PHP_EOL;
			
			array_push($data,$a);
		}
	}
	/*for ($x = 0; $x <= count($data); $x++) {
		//print_r($data[$x]);
		//$a = $data[$x]->getAttribute('href');
		//echo $data[$x]->parentNode->parentNode->childNodes[7]->nodeValue, PHP_EOL;
		array_push($data2,$data[$x]->parentNode->parentNode->childNodes[7]->textContent);
	}
	array_pop($data2);*/
	foreach ($data as &$a) {
		//$href = getSrc("https://downloads.khinsider.com".$href);
		foreach ($links as $link) {
			if (strpos($link->getAttribute('href'), $a[0]) !== false) {
				//echo $href, PHP_EOL;
				//echo $link->textContent, PHP_EOL;
				//$data2[$link->textContent] = $a[0];
				$a[1] = $link->textContent;
				str_replace("&#8203;", "", $a[1]);
				$a[1] = preg_replace( '/[\x{200B}-\x{200D}]/u', ' ', $a[1]);
				break;
			}
		}
	}
	//echo stripcslashes(json_encode($data));
	echo stripslashes(json_encode($data));
	
?>
