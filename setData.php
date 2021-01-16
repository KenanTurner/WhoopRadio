<?php
    //https://stackoverflow.com/a/2021729
    function findDirectory($dir){
	    if(is_dir($dir)){
		    return $dir;
	    }
	    return findDirectory('../'.$dir);
    }
    $file = mb_ereg_replace("([^\w\s\d\-_~,;\[\]\(\).])", '', $_POST["filename"].".json");
    $file = mb_ereg_replace("([\.]{2,})", '', $file);
    $dir = findDirectory("music/");
    if($_POST["del"] == "true"){
	unlink($dir.$file);
	echo "successfully deleted ".$file;
    }else{
	$myfile = fopen($dir.$file, "w") or die("Unable to open file!");
	fwrite($myfile, $_POST["data"]);
	fclose($myfile);
	echo "successfully uploaded ".$file;
    }
?>

