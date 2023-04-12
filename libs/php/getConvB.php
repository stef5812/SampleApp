<?php

	// Standard php call to get api data

	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);


//		case 'getCountryDatav2':
			$url='https://api.getthedata.com/bng2latlong/' . $_REQUEST['east'] . '/' . $_REQUEST['north'];	
            //$url = 'https://maps.googleapis.com/maps/api/geocode/json?address=' . $_REQUEST['ECode'] . '&key=AIzaSyA9nkEcyyqNKAo4r5lCGZIx0Eb2slOau54';
	  //process 2nd part, set Curl settings
//		default:
			$ch = curl_init();
			curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
			curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
			curl_setopt($ch, CURLOPT_URL,$url);
		
			$result=curl_exec($ch);
		
			curl_close($ch);
		
			$decode = json_decode($result,true);			
	  

	  //Standard central part for all
	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";

	//how to end the process
	$output['data'] = $decode;
	
	
	header('Content-Type: application/json; charset=UTF-8');

	echo json_encode($output); 

?>