<?php
    $files = glob("blogPosts/*.*");
	for ($i=0; $i<count($files); $i++){
        $myfile = fopen($files[$i], "r") or die("Unable to open file!");
        echo "<div style=\"border: 1px groove; border-radius: 5px; padding: 16px;\">".nl2br(fread($myfile,filesize($files[$i])));
        fclose($myfile);
        echo "<br/><center>";
        echo substr($files[$i],10);
        echo "</center></div><br/><br/>";
    }
?>
