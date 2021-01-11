<?php
	$file = "The 8-Bit Big \Band - \"The K.K. 'Sessions'\".json";
    $file = mb_ereg_replace("([^\w\s\d\-_~,;\[\]\(\).])", '', $file);
	// Remove any runs of periods (thanks falstro!)
	$file = mb_ereg_replace("([\.]{2,})", '', $file);
    //fwrite($myfile, filter_var($_POST["data"], FILTER_SANITIZE_STRING));
    echo "successfully uploaded ".$file.".json";
?>

