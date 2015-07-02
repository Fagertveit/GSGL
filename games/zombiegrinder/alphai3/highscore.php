<?php 
header('Cache-Control: no-cache');
header('Pragma: no-cache');

require_once 'init.php';

if($_GET['action'] == 'get')
{
	$jsonObject = Array();
	$id = 0;
	
	$conn = mysqli_connect(
            DB_HOST,  /* The host to connect to */
            DB_USER,       /* The user to connect as */
            DB_PASS,   /* The password to use */
            DB_NAME);     /* The default database to query */

	if (!$conn) {
   		printf("Can't connect to MySQL Server. Errorcode: %s\n", mysqli_connect_error());
   		exit;
	}
	/* Send a query to the server */
	if ($result = $conn->query("SELECT score, name, level FROM zombiegrinder ORDER BY score DESC LIMIT " . $_GET['posts']))
	{
			
    	while( $row = mysqli_fetch_assoc($result) )
    	{
    		$jsonObject[$id]['score'] = $row['score'];
    		$jsonObject[$id]['name'] = $row['name'];
    		$jsonObject[$id]['level'] = $row['level'];
    		$id++;
		}
			
    	/* Destroy the result set and free the memory used for it */
		mysqli_free_result($result);
	}
	else {
		echo "Error!";
	}
	/* Close the connection */
	mysqli_close($conn);
	
	
	echo json_encode($jsonObject);
}
else if($_GET['action'] == 'put')
{
	$mysqli = mysqli_connect(
            DB_HOST,  /* The host to connect to */
            DB_USER,       /* The user to connect as */
            DB_PASS,   /* The password to use */
            DB_NAME);     /* The default database to query */

		if (!$mysqli) {
   			printf("Can't connect to MySQL Server. Errorcode: %s\n", mysqli_connect_error());
   			exit;
		}
		if ($stmt = $mysqli->prepare("INSERT INTO zombiegrinder (name, score, level, ip) VALUES (?, ?, ?, ?)")) {
    		$stmt->bind_param("siis", $name, $score, $level, $ip);
    		
    		$name = $_GET['name'];
    		$score = $_GET['score'];
    		$level = $_GET['level'];
    		$ip = $_SERVER['REMOTE_ADDR'];

    		$stmt->execute(); 
    		/* close statement */
    		$stmt->close();
		}
		else {
			echo "Failure!";
		}
		mysqli_close($mysqli);
		
		echo "Success!";
}
?>