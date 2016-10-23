// GLOBAL VARIABLES

var puzzlesize = 400;	// size of the board (400px)
var numpieces = 4;		// grid size (4x4)
var piecesize;			// size of a single piece
var emptysquare;		// position of the empty square
var pieces;				// variable to store array of pieces
var movetime = 250;		// time to move one piece
var shuffled = false;	// boolean to track if board is solved or not

// for win 
var bg = 0;
var font = 0;

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
				// check if game is won when empty space is in bottom right
				if(shuffled){
					if(emptysquare[0] == numpieces-1 && emptysquare[1] == numpieces-1){
						setTimeout(checkIfWon, 500);
					}
				}
			});
		} else {
			$(this).removeClass("movablepiece");
			$(this).unbind("click");
		}
	});

}

// function to check if game is won
function checkIfWon(){

	var good = true;

	$(pieces).each(function(){

		var piecenumber = $(this).html();
		var xpos = parseInt($(this).attr("x"));
		var ypos = parseInt($(this).attr("y"));

		if(xpos != (piecenumber-1)%numpieces || ypos != Math.ceil(piecenumber/numpieces - 1))
			good = false;

	});

	if(good)
		youWin();
}

// function to alert player that they won
function youWin(){
	shuffled = false;

	// main overlay container
	var overlay = $('<div id="overlay">').css({
	    "width" : "100%",
	    "height" : "100%",
	    "background-color" : "rgba(255, 255, 0, 0.6)",
	    "position" : "fixed",
	    "top" : "0",
		"left" : "0",
		"zIndex" : "50",
		"text-align" : "center",
		"cursor" : "pointer"

	}).click(function(){
		$(this).remove();
	});
	$(overlay).appendTo(document.body);

	var cont = $('<div>').appendTo(overlay);

	var winner = $('<h1 id="winner">').html("CONGRATULATIONS!! YOU WON!!!").css({
		"margin-top" : "60px",
		"margin-bottom" : "-40px",
		"font-size" : "64px",
		"font-style" : "italic",
		"text-shadow" : "1px 0 black",
		"color" : "#ff0000"
	});
	$(winner).appendTo(cont);

	// overlay message
	$('<img src="http://img09.deviantart.net/5707/i/2011/294/5/3/it__s_time_to_duel_by_dbkaifan2009-d4dk24u.png">').css({
		"zIndex" : "100",
		"margin" : "100px"
	}).css({
		"width" : "50%"
	}).insertAfter(winner);

	$(cont).hide();
	$(cont).slideToggle(1500);

	setTimeout(toggleBG, 50);
	setTimeout(toggleFont, 800);
}

// function to change the win background color
function toggleBG(){
	if(bg==0){
		$("#overlay").css({ "background-color" : "rgba(255, 0, 0, 0.6)" });
		bg = 1;
	} else {
		$("#overlay").css({ "background-color" : "rgba(255, 255, 0, 0.6)" });
		bg = 0;
	}

	setTimeout(toggleBG, 50);
}

// function to change the win text color
function toggleFont(){
	if(font==0){
		$("#winner").css({ "color" : "#ffff00" });
		font = 1;
	} else {
		$("#winner").css({ "color" : "#ff0000" });
		font = 0;
	}

	setTimeout(toggleFont, 800);
}