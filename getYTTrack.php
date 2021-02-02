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
    
    function parseTime($time){
        $interval = new DateInterval($time);
        return dateIntervalToSeconds($interval);
    }
    function dateIntervalToSeconds($dateInterval){
        $reference = new DateTimeImmutable;
        $endTime = $reference->add($dateInterval);

        return $endTime->getTimestamp() - $reference->getTimestamp();
    }
    
    function getYoutubeJson($track_id){
        $dir = "youtube.ini";
        $dir = findFile($dir);
        $api_key = parse_ini_file($dir)[api_key];
        $api_url = 'https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails&id='.$track_id.'&key='.$api_key;
        return json_decode(file_get_contents($api_url));
    }
    $track = array();
    $data = getYoutubeJson($id)->items[0];
    $track[0] = "https://www.youtube.com/watch?v=".$data->id;
    $track[1] = $data->snippet->title;
    $track[2] = $data->snippet->channelTitle;
    $track[3] = parseTime($data->contentDetails->duration);
    $track[4] = "YT";
    $track[5] = -1;
    $artwork_url = $data->snippet->thumbnails->maxres->url;
    if (empty ($artwork_url)) {
        $artwork_url = $data->snippet->thumbnails->standard->url;
    }
    if (empty ($artwork_url)) {
        $artwork_url = $data->snippet->thumbnails->high->url;
    }
    if (empty ($artwork_url)) {
        $artwork_url = $data->snippet->thumbnails->medium->url;
    }
    if (empty ($artwork_url)) {
        $artwork_url = $data->snippet->thumbnails->default->url;
    }
    $track[6] = $artwork_url;
    echo json_encode($track,JSON_UNESCAPED_SLASHES);
?>
