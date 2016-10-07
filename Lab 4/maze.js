window.onload = function(){

	var startblock = document.getElementById("start");
	// select all boundaries except example
	var boundaries = document.querySelectorAll(".boundary:not(.example)");

	// start game when start block is hovered
	startblock.onmouseover = function(){
		// set for each boudary
		for(i=0; i < boundaries.length; i++){
			var boundary = boundaries[i];
			boundary.onmouseover = function(){
				youLose();
			};
		}
	};

	// function to loop through the boundaries turning them red
	function youLose(){
		for(i=0; i < boundaries.length; i++){
			var boundary = boundaries[i];
			// add "youlose" class since changing class resulted in unexpected behvaiour
			boundary.className += " youlose";
		}
	}

};