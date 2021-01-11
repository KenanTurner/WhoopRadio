<?php
	//initialize variables
	$trackNames = array();
	$folderNames = array();
	$SRCList = array();
	$combined = array();

	$dir    = 'music/'; //change directory if needed
	$textFile = 'tracks.txt'; //change file holding href info
	$dirs = scandir($dir);
	array_splice($dirs,0,2);
	$folderNames = $dirs; //folderNames
	for ($i=0; $i<count($dirs); $i++)
	{
		$files = glob("music/$dirs[$i]/*.*"); //grab all files
		for ($k=0; $k<count($files); $k++)
		{
			if($files[$k] == "music/$dirs[$i]/$textFile"){ //remove tracks.txt
				unset($files[$k]);
			}
		}
		
		//These will hold the track names and src for each folder
		$tmpTrackNames = array();
		$tmpSRCList = array();
		
		//Add the html audio first
		for ($k=0; $k<count($files); $k++)
		{
			array_push($tmpTrackNames,pathinfo($files[$k], PATHINFO_FILENAME)); //Add mp3
			array_push($tmpSRCList,$files[$k]);
		}
		
		//Add the Youtube/Soundcloud audio second
		$myfile = fopen("music/$dirs[$i]/$textFile", "r");
		$str =  fread($myfile,filesize("music/$dirs[$i]/$textFile")); 
		fclose($myfile);
		$str = explode("\n",$str);
		for ($j=0; $j<count($str); $j++)
		{
			if($str[$j]==""){
				break;
			}
			$str2 = explode(",",$str[$j],2);
			array_push($tmpSRCList,$str2[0]);
			array_push($tmpTrackNames,end($str2));
		}

		//Add them back
		array_push($trackNames,$tmpTrackNames);
		array_push($SRCList,$tmpSRCList);
		$tmp = array_combine($tmpTrackNames,$tmpSRCList);
		array_push($combined,$tmp);
		

	}
	
	echo json_encode(['trackNames' => $trackNames,'folderNames' => $folderNames,'SRCList' => $SRCList,'combined' => array_combine($folderNames,$combined)]);
	//echo json_encode(['trackNames' => $trackNames,'tmp' => [0]]);
?>
