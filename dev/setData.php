<?php
    //https://stackoverflow.com/a/2021729
    $file = mb_ereg_replace("([^\w\s\d\-_~,;\[\]\(\).])", '', $_POST["filename"].".json");
    $file = mb_ereg_replace("([\.]{2,})", '', $file);
    $myfile = fopen("music/".$file, "w") or die("Unable to open file!");
    fwrite($myfile, $_POST["data"]);
    fclose($myfile);
    echo "successfully uploaded ".$file;
?>

