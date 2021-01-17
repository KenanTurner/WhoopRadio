<?php
    date_default_timezone_set('America/Chicago');
    //https://stackoverflow.com/a/2021729
    function findDirectory($dir){
	    if(is_dir($dir)){
		    return $dir;
	    }
	    return findDirectory('../'.$dir);
    }
    $dir = findDirectory("music/");
    $zip = new ZipArchive();
    $filename = str_replace("music/","",$dir)."music--".date("m-d-Y").".zip";

    if ($zip->open($filename, ZipArchive::CREATE | ZipArchive::OVERWRITE)!==TRUE) {
	exit("cannot open <$filename>\n");
    }
    $options = array('add_path' => ' ', 'remove_all_path' => TRUE);
    $zip->addGlob($dir."*.json*", GLOB_BRACE, $options);
    $zip->close();
    //str_replace("music/","",$dir);
    echo $filename;
?>

