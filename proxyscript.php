<?php
    header("Access-Control-Allow-Origin: *");

    $html = get_page($_GET['url']);
    //echo get_page("http://www.google.com");
    function get_page($url){
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL,$url);
        /*
        $proxy = 'http://proxy.company.com:8080';
        $proxyauth = 'domain\proxy_username:proxy_password';
        curl_setopt($ch, CURLOPT_PROXY, $proxy);
        curl_setopt($ch, CURLOPT_PROXYUSERPWD, $proxyauth);
        */
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_HEADER, 0);
        $data = curl_exec($ch);
        curl_close($ch);
        return $data;
    }
    
    /*$dom = new DOMDocument;  
	libxml_use_internal_errors(true);

	$dom->loadHTML( $html ); 
	$xpath = new DOMXPath( $dom );
	libxml_clear_errors();

	$doc = $dom->getElementsByTagName("html")->item(0);
	$src = $xpath->query(".//@src");

	foreach ( $src as $s ) {
	  //$s->nodeValue = array_pop( explode( "/", $s->nodeValue ) );
	  $s->nodeValue = "https://www.youtube.com".$s->nodeValue;
	  //echo $s->nodeValue;
	}
	$output = $dom->saveXML( $doc );*/
	$dom = new DOMDocument;  
	libxml_use_internal_errors(true);

	$dom->loadHTML( $html ); 
	$h1 = $dom->getElementsByTagName("script");
	//$hrefs = array();
	//echo count($h1);
	foreach ($h1 as $h) {
		$tmp = $h->getAttribute('src');
		if($tmp==NULL){
			continue;
		}
		$tmp = "https://www.youtube.com".$tmp;
		$h->setAttribute('src',$tmp);
		//echo $h->getAttribute('src');
		//echo trim($tmpJson["trackinfo"][0]["file"]["mp3-128"]);
	}
	//echo "Pain";
    echo $dom->saveHTML();
?>
