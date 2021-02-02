<?php
    //$url = $_POST["href"];
    //$url = "PLvNp0Boas723CiuhA_qJDad2r1XmAZaBw";
    $id =  $_POST["id"];
    
    function findFile($dir){
		if(file_exists($dir)){
			return $dir;
		}
		return findFile('../'.$dir);
	}
    
    function getYoutubeJson($playlist_id,$pageToken=""){
        $dir = "youtube.ini";
        $dir = findFile($dir);
        $api_key = parse_ini_file($dir)[api_key];
        $api_url = 'https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&pageToken=' . $pageToken . '&playlistId='. $playlist_id . '&key=' . $api_key;
        return json_decode(file_get_contents($api_url));
    }
    $album = array();
    $title = mb_ereg_replace("([^\w\s\d\-_~,;\[\]\(\).])", '', $_POST["albumTitle"]);
    //$title = mb_ereg_replace("([\.]{2,})", '', $file);
    $album[0] = $title;
    $album[1] = array();

    //$myfile = fopen("music/".$folder."/tracks.txt", "a") or die("Unable to open file!");
    
    
    $hrefs = array();
    $pageToken = "";
    $count = 0;
    while ($count < 10){
        $playlist = getYoutubeJson($id,$pageToken);
        $pageToken = $playlist->nextPageToken;
        //print_r($playlist);
        
        $track = array();
        foreach ($playlist->items AS $item){
            //print_r($item);
            $title = $item->snippet->title;
            $src = "https://www.youtube.com/watch?v=".$item->snippet->resourceId->videoId;
            $artist = $item->snippet->channelTitle;
            $track_num = $item->snippet->position;
            $artwork_url = $item->snippet->thumbnails->maxres->url;
            if (empty ($artwork_url)) {
                $artwork_url = $item->snippet->thumbnails->standard->url;
            }
            if (empty ($artwork_url)) {
                $artwork_url = $item->snippet->thumbnails->high->url;
            }
            if (empty ($artwork_url)) {
                $artwork_url = $item->snippet->thumbnails->medium->url;
            }
            if (empty ($artwork_url)) {
                $artwork_url = $item->snippet->thumbnails->default->url;
            }
            $track[0] = $src;
            $track[1] = $title;
            $track[2] = $artist;
            $track[3] = -1;
            $track[4] = "YT";
            $track[5] = $track_num;
            $track[6] = $artwork_url;
            //array_push($album[1],json_encode($track));
            array_push($album[1],$track);
        }
        //echo $pageToken." ";
        $count += 1;
        if($pageToken==""){
            break;
        }
    }
    $album[2] = "";
    $album[3] = "";
    $album[4] = $album[1][0][6];
    echo json_encode($album,JSON_UNESCAPED_SLASHES);
?>
