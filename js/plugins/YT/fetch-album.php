<?php
    $data = json_decode(file_get_contents('php://input'), true);
	$id = $data["id"];
    $url = $data["url"];
	if(empty($id) or empty($url)){
		http_response_code(500);
		exit("URL and ID is required!");
	}
    
    function getYoutubeJson($playlist_id,$pageToken=""){
        $dir = "./youtube.ini";
        $api_key = parse_ini_file($dir)["api_key"];
        $api_url = 'https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&pageToken=' . $pageToken . '&playlistId='. $playlist_id . '&key=' . $api_key;
        return json_decode(file_get_contents($api_url));
    }
    $album = array();
    $album['src'] = $url;
    
    //$album['data'] = array();
    $album['tracks'] = array();
    $pageToken = "";
    $count = 0;
    while ($count < 100){ //max length of 5000
        $playlist = getYoutubeJson($id,$pageToken);
        $pageToken = $playlist->nextPageToken;
        //array_push($album['data'],$playlist);
        
        foreach ($playlist->items AS $item){
            if($item->snippet->title=="Private video" or $item->snippet->title=="Deleted video"){
                continue;
            }
            $track = array();
            $track['title'] = $item->snippet->title;
            $track['src'] = "https://www.youtube.com/watch?v=".$item->snippet->resourceId->videoId;            
            $track['artist'] = $item->snippet->videoOwnerChannelTitle;
            $track['artwork_url'] = (empty($track['artwork_url']))?$item->snippet->thumbnails->maxres->url:$track['artwork_url'];
            $track['artwork_url'] = (empty($track['artwork_url']))?$item->snippet->thumbnails->high->url:$track['artwork_url'];
            $track['artwork_url'] = (empty($track['artwork_url']))?$item->snippet->thumbnails->standard->url:$track['artwork_url'];
            $track['artwork_url'] = (empty($track['artwork_url']))?$item->snippet->thumbnails->medium->url:$track['artwork_url'];
            $track['artwork_url'] = (empty($track['artwork_url']))?$item->snippet->thumbnails->default->url:$track['artwork_url'];
            $track['filetype'] = "YT";
            array_push($album['tracks'],$track);
        }
        $count += 1;
        if($pageToken==""){
            break;
        }
    }
    echo json_encode($album);
?>
