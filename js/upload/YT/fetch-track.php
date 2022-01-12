<?php
    $data = json_decode(file_get_contents('php://input'), true);
	if(empty($data) or empty($data['id'])){
		http_response_code(500);
		exit("Track w/ ID is required!");
	}
    
    function getYoutubeJson($track_id){
        $file = "./youtube.ini";
        $api_key = parse_ini_file($file)["api_key"];
        $api_url = 'https://youtube.googleapis.com/youtube/v3/videos?part=snippet&id='. $track_id . '&key=' . $api_key;
        return json_decode(file_get_contents($api_url));
    }
    
    $items = getYoutubeJson($data['id']);
    if(empty($items) or count($items) != 1){
        http_response_code(500);
		exit("YT API failed!");
    }
	
    $track = array();
    $track['src'] = 'https://www.youtube.com/watch?v='.$data['id'];
    $track['title'] = $items->items[0]->snippet->title;
    $track['artist'] = $items->items[0]->snippet->channelTitle;
    $tmp = $items->items[0]->snippet->thumbnails;
    $track['artwork_url'] = (empty($track['artwork_url']))?$tmp->maxres->url:$track['artwork_url'];
    $track['artwork_url'] = (empty($track['artwork_url']))?$tmp->high->url:$track['artwork_url'];
    $track['artwork_url'] = (empty($track['artwork_url']))?$tmp->standard->url:$track['artwork_url'];
    $track['artwork_url'] = (empty($track['artwork_url']))?$tmp->medium->url:$track['artwork_url'];
    $track['artwork_url'] = (empty($track['artwork_url']))?$tmp->default->url:$track['artwork_url'];
    $track['filetype'] = 'YT';
    echo json_encode($track);
?>
