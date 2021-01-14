<?php
	function findDirectory($dir){
		if(is_dir($dir)){
			return $dir;
		}
		return findDirectory('../'.$dir);
	}
	$dir = findDirectory("music/");
	$files = glob($dir."*.json*");
	echo "[";
	for ($i=0; $i<count($files); $i++){
        $myfile = fopen($files[$i], "r") or die("Unable to open file!");
        echo fread($myfile,filesize($files[$i]));
        if($i != count($files)-1){
			echo ",";
		}
        fclose($myfile);
    }
    echo "]";
?>
