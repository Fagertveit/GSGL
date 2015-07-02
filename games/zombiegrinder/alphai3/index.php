<!doctype html>
<html>
<head>
<meta http-equiv='Content-Type' content='text/html;charset=ISO-8859-1' />
<meta description="Zombie grinder - Goto stack 'em zombieparts real good! After a long day zombiehunting we need to get them parts grinded, or things get out of controll." />
<title>Zombie Grinder - Goto stack 'em zombieparts real good!</title>
<script>
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-27673923-2', 'auto');
  ga('send', 'pageview');

</script>
<script type='text/javascript' src='scripts/cgl.js'></script>
<script type='text/javascript' src='scripts/zt-0.1.js'></script>
<script type='text/javascript' src='game.js'></script>
<script type='text/javascript' src='scripts/json.js'></script>

<link rel='stylesheet' type='text/css' href='scripts/default.css' />
<?php if(isset($_GET['iframe'])): ?>
<style>
body {
	margin: 0;
}

#canvas {
	margin: 0;
}
</style>
<?php endif; ?>
</head>
<body>

	<div id='container'>

		<div id='canvas'></div>

	</div>

	<div id='preloaded'>
		<img id='loadingtxt' src='images/loading_text.png' /> <img
			id='loading1' src='images/loading1.png' /> <img id='loading2'
			src='images/loading2.png' onload='init();' />
	</div>

	<div id='dampner'></div>

	<div id='hsform'>

		<div class='hstitle'>Enter high-score!</div>
		<div class='hslabel'>Score</div>
		<div id='hsscore'></div>
		<div class='hslabel'>Level</div>
		<div id='hslevel'></div>
		<input id='hsname' type='text' maxlength='16' value='Your Name!' /><br />
		<div id='hsbutton' onclick='submitHighScore();'>Submit!</div>

	</div>

	<div id='ajaxindicator'>

		<img src='images/ajaxindicator2.gif' border='0' />

	</div>

</body>
</html>
