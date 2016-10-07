window.onload = function(){

	var inProgress = true;
	var startblock = document.getElementById("start");
	// select all boundaries except example
	var boundaries = document.querySelectorAll(".boundary:not(.example)");
	var endBlock = document.getElementById("end");

	// start game when start block is hovered
	startblock.onmouseover = function(){
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
				inProgress = false;
				alert("You win!");
			}
		};
	};

	// reset game when start block is clicked
	startblock.onclick = function(){
		inProgress = true;
		for(i=0; i < boundaries.length; i++){
			var boundary = boundaries[i];
			// reset class name
			boundary.className = "boundary";
		}
	};

	// function to loop through the boundaries turning them red
	function youLose(){
		inProgress = false;
		for(i=0; i < boundaries.length; i++){
			var boundary = boundaries[i];
			// add "youlose" class since changing class resulted in unexpected behvaiour
			boundary.className += " youlose";
		}
	}

};