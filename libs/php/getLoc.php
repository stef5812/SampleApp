<?php

$curl = curl_init();

curl_setopt_array($curl, [
	CURLOPT_URL => "https://eircodr1.p.rapidapi.com/getAddress",
	CURLOPT_RETURNTRANSFER => true,
	CURLOPT_FOLLOWLOCATION => true,
	CURLOPT_ENCODING => "",
	CURLOPT_MAXREDIRS => 10,
	CURLOPT_TIMEOUT => 30,
	CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
	CURLOPT_CUSTOMREQUEST => "POST",
	CURLOPT_POSTFIELDS => "{\r
    \"eircode\": \"D08 WC64\"\r
}",
	CURLOPT_HTTPHEADER => [
		"X-RapidAPI-Host: eircodr1.p.rapidapi.com",
		"X-RapidAPI-Key: 3b993ed73amsh7a2a0ee84080fe3p133fd9jsnb82dc763249f",
		"content-type: application/json"
	],
]);

$response = curl_exec($curl);
$err = curl_error($curl);

curl_close($curl);

if ($err) {
	echo "cURL Error #:" . $err;
} else {
	echo $response;
}

?>