window.onload = function(){

	var inProgress = true;
	var startblock = document.getElementById("start");
	// select all boundaries except example
	var boundaries = document.querySelectorAll(".boundary:not(.example)");
	var endBlock = document.getElementById("end");
	var statusBlock = document.getElementById("status");

	// start game when start block is hovered
	startblock.onmouseover = function(){
		// set status block
		if(inProgress)
			statusBlock.innerHTML = "Good luck!";
		// set for each boudary
		for(i=0; i < boundaries.length; i++){
			var boundary = boundaries[i];
			boundary.onmouseover = function(){
				if(inProgress)
					youLose();
			};
		}
		// end clause
		endBlock.onmouseover = function(){
			if(inProgress){
				// set status block
				statusBlock.innerHTML = "You win!";
				inProgress = false;
			}
		};
	};

	// reset game when start block is clicked
	startblock.onclick = function(){
		// set status block
		statusBlock.innerHTML = "Good luck!";
		inProgress = true;
		for(i=0; i < boundaries.length; i++){
			var boundary = boundaries[i];
			// reset class name
			boundary.className = "boundary";
		}
	};

	// function to loop through the boundaries turning them red
	function youLose(){
		// set status block
		statusBlock.innerHTML = "You lose!";
		inProgress = false;
		for(i=0; i < boundaries.length; i++){
			var boundary = boundaries[i];
			// add "youlose" class since changing class resulted in unexpected behvaiour
			boundary.className += " youlose";
		}
	}

};