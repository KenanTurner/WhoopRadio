<?php
	date_default_timezone_set('America/Chicago');
	function findDirectory($dir){
	    if(is_dir($dir)){
		    return $dir;
	    }
	    return findDirectory('../'.$dir);
    }
    function findFile($dir){
		if(file_exists($dir)){
			return $dir;
		}
		return findFile('../'.$dir);
	}
	if (isset($_POST['id'])) {
		$file = mb_ereg_replace("([^\w\s\d\-_~,;\[\]\(\).])", '', $_POST['id'].".json");
		$file = mb_ereg_replace("([\.]{2,})", '', $file);
		$dir = findDirectory("users/");
		
		$info = array();
		$info[0] = date("m/d/Y");
		$info[1] = date("H:i:s");
		$info[2] = $_SERVER["REMOTE_ADDR"];
		$info[3] = filter_var($_POST['page'],FILTER_SANITIZE_STRING);
		$data = json_decode($_POST['data']);
		$data = filter_var_array($data,FILTER_SANITIZE_STRING);
		foreach($data as $item){
			array_push($info,$item);
		}
		$myfile = fopen($dir.$file, "a") or die("Unable to open file!");
		fwrite($myfile, stripslashes(json_encode($info)."\r\n"));
		fclose($myfile);
		
		$dir = findFile("log.json");
		$myfile = fopen($dir, "a") or die("Unable to open file!");
		fwrite($myfile, stripslashes(json_encode($info)."\r\n"));
		fclose($myfile);
	}
?>
