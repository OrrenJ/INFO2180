// GLOBAL VARIABLES

var puzzlesize = 400;	// size of the board (400px)
var numpieces = 4;		// number of pieces on the board. 4 indicates 4x4, 5 indicates 5x, etc
var piecesize;			// size of a single piece
var emptysquare;		// position of the empty square
var pieces;				// variable to store array of pieces
var movetime = 250;		// time to move one piece
var shuffled = false;	// boolean to track if board is solved or not

// "main" function
$(document).ready(function(){

	doInitialSetup();	// perform the initial board setup
	findValidMoves();	// find valid moves

	$("#shufflebutton").click(function(){
		// loop to shuffle board by moving backwards from finished state
		var start = Date.now();
		movetime = 0;
		for(var i=0; i<300; i++){
			var moves = $(".movablepiece").toArray();
			var tomove = moves[Math.floor(Math.random() * moves.length)];
			$(tomove).click();
		}
		movetime = 250;
		shuffled = true;
		console.log(Date.now()-start);	// log time spent shuffling
	});

});

// UTILITY FUNCTIONS

// function to setup the board at the start of the game
function doInitialSetup(){

	piecesize = puzzlesize/numpieces;
	emptysquare = [ numpieces-1, numpieces-1 ];

	pieces = $("#puzzlearea div");
	$(pieces).each(function(){
		// position the pieces
		var piecenumber = $(this).html();
		var xpos = (piecenumber-1)%numpieces;				// 0-3
		var ypos = Math.ceil(piecenumber/numpieces - 1);	// 0-3
		positionPiece(this, xpos, ypos, 0);

		// set the background for each piece
		$(this).addClass("puzzlepiece");
		$(this).css({backgroundPosition: "-" + xpos*piecesize + "px -" + ypos*piecesize + "px" });	// eg, -0px -0px
	});
}

// function to position a single piece
function positionPiece(piece, x, y, time){
	var xpos = x * piecesize;
	var ypos = y * piecesize;

	$(piece).animate({ left: xpos, top: ypos }, time);

	$(piece).attr("x", x);
	$(piece).attr("y", y);
}

// function to find valid moves
function findValidMoves(){
	
	var esx = emptysquare[0];
	var esy = emptysquare[1];

	$(pieces).each(function(){
		
		var xpos = parseInt($(this).attr("x"));
		var ypos = parseInt($(this).attr("y"));

		var left  = (xpos == esx-1 && ypos == esy);
		var above = (xpos == esx   && ypos == esy-1);
		var right = (xpos == esx+1 && ypos == esy);
		var below = (xpos == esx   && ypos == esy+1);

		if(left || above || right || below){
			$(this).addClass("movablepiece");
			$(this).click(function(){
				positionPiece(this, esx, esy, movetime);
				emptysquare[0] = xpos;
				emptysquare[1] = ypos;
				findValidMoves();
			});
		} else {
			$(this).removeClass("movablepiece");
			$(this).unbind("click");
		}
	});

}
