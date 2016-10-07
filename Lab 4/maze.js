window.onload = function(){

	var startblock = document.getElementById("start");
	var boundary1 = document.getElementById("boundary1");

	// start game when start block is hovered
	startblock.onmouseover = function(){
		boundary1.onmouseover = function(){
			// add "youlose" class since changing class resulted in unexpected behvaiour
			boundary1.className += " youlose";
		};
	};
};