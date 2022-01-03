<?php
    $data = json_decode(file_get_contents('php://input'), true);
	$id = $data["id"];
    $url = $data["url"];
	if(empty($id) or empty($url)){
		http_response_code(500);
		exit("URL and ID is required!");
	}
    
    function getYoutubeJson($track_id,$pageToken=""){
        $dir = "./youtube.ini";
        $api_key = parse_ini_file($dir)["api_key"];
        $api_url = 'https://youtube.googleapis.com/youtube/v3/videos?part=snippet&id='. $track_id . '&key=' . $api_key;
        return json_decode(file_get_contents($api_url));
    }
    $track = array();
    $track['src'] = $url;
    
    $item = getYoutubeJson($id,$pageToken);
    if(count($item->items) != 1){
        http_response_code(500);
		exit("Invalid ID!");
    }
    
    $track['title'] = $item->items[0]->snippet->title;
    $track['artist'] = $item->items[0]->snippet->channelTitle;
    $tmp = $item->items[0]->snippet->thumbnails;
    $track['artwork_url'] = (empty($track['artwork_url']))?$tmp->maxres->url:$track['artwork_url'];
    $track['artwork_url'] = (empty($track['artwork_url']))?$tmp->high->url:$track['artwork_url'];
    $track['artwork_url'] = (empty($track['artwork_url']))?$tmp->standard->url:$track['artwork_url'];
    $track['artwork_url'] = (empty($track['artwork_url']))?$tmp->medium->url:$track['artwork_url'];
    $track['artwork_url'] = (empty($track['artwork_url']))?$tmp->default->url:$track['artwork_url'];
    $track['filetype'] = 'YT';
    echo json_encode($track);
?>
