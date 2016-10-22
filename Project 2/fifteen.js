$(document).ready(function(){

	var puzzlesize = 400;	// size of the board (400px)
	var numpieces = 4;		// number of pieces on the board. 4 indicates 4x4, 5 indicates 5x, etc
	var piecesize = puzzlesize/numpieces;
	var emptysquare;		// position of the empty square
	var pieces;				// variable to store array of pieces

	doInitialSetup();	// perform the initial board setup

	// function to setup the board at the start of the game
	function doInitialSetup(){

 		emptysquare = [ numpieces-1, numpieces-1 ];

		pieces = $("#puzzlearea div");
		$(pieces).each(function(){
			// position the pieces
			var piecenumber = $(this).html();
			var xpos = (piecenumber-1)%numpieces;				// 0-3
			var ypos = Math.ceil(piecenumber/numpieces - 1);	// 0-3
			positionPiece(this, xpos, ypos, false);

			// set the background for each piece
			$(this).addClass("puzzlepiece");
			$(this).css({backgroundPosition: "-" + xpos*piecesize + "px -" + ypos*piecesize + "px" });	// eg, -0px -0px
		});
	}

	// function to position a single piece
	function positionPiece(piece, x, y, anim){
		var xpos = x * piecesize;
		var ypos = y * piecesize;
		var time;

		if(anim)
			time = 250;
		else
			time = 0;

		$(piece).animate({ left: xpos, top: ypos }, time);

		$(piece).attr("x", x);
		$(piece).attr("y", y);
	}
});