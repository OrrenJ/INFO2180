/*

Orren Joseph - 413001000

Extra features implpemented:
- End-of-game notification (grade this, see youWin())
- Animations and/or transitions
- Game time
- Multiple backgrounds

*/

// GLOBAL VARIABLES

var puzzlesize = 400;			// size of the board (400px)
var numpieces = 4;				// grid size (4x4)
var piecesize;					// size of a single piece
var emptysquare;				// position of the empty square
var pieces;						// variable to store array of pieces
var movetime = 250;				// time to move one piece
var shuffled = false;			// boolean to track if board is solved or not
var start;						// holder for timestamp of shuffle clicked
var nummoves = 0;				// number of moves made
var besttime = 999999;			// arbitrary default
var leastmoves = 999999;		// arbitrary default

// background images
var bg_urls = [ "background.jpg",
				"http://i.imgur.com/BEYGB2N.jpg",
				"http://i.imgur.com/3kGIRSu.jpg",
				"http://i.imgur.com/mqYvtPa.jpg",
				"http://i.imgur.com/NEyZmBA.jpg",
				"http://i.imgur.com/VsFgBt8.jpg" ];
// names for backgrounds
var bg_names = [ "Gengar",
				 "Pikachu",
				 "Eevee",
				 "Gyarados",
				 "Onix",
				 "Horsea" ];

var background = bg_urls[0];	// holder for background image

// "main" function
$(document).ready(function(){

	doInitialSetup();	// perform the initial board setup
	findValidMoves();	// find valid moves

	$("#shufflebutton").click(function(){
		// loop to shuffle board by moving backwards from finished state
		start = Date.now();
		movetime = 0;
		for(var i=0; i<300; i++){
			var moves = $(".movablepiece").toArray();
			var tomove = moves[Math.floor(Math.random() * moves.length)];
			$(tomove).click();
		}
		movetime = 250;
		shuffled = true;
		nummoves = 0;
		var shuffletime = Date.now() - start;
		console.log("Shuffle: " + shuffletime + "ms");	// log time spent shuffling
	});

	// add selector for different backgrounds
	var select_bg = $("<select id='select_bg'>").css({"margin":"8px"});
	for(i=0; i<bg_urls.length; i++){
		$("<option>").val(bg_urls[i]).html(bg_names[i]).appendTo(select_bg);
	}
	$("#shufflebutton").before(select_bg);

	// method invoked when option selected
	$(select_bg).change(function(){
		background = $(this).val();
		$(pieces).css({ "background-image" : "url(" + background + ")" });
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
				// ignore duplicate clicks
				$(this).unbind("click");
				nummoves++;
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

// function to convert milliseconds to minutes and seconds
function msToMinSec(ms){
	var min = Math.floor(ms/1000/60);
	var sec = Math.floor((ms/1000)%60);
	return min + "m " + sec + "s";
}

// function to alert player that they won
function youWin(){
	shuffled = false;
	var time = Date.now() - start;
	wintime = msToMinSec(time);
	console.log("Solve: " + wintime);
	console.log("Moves: " + nummoves);

	if(time < besttime)
		besttime = time

	if(nummoves < leastmoves)
		leastmoves = nummoves

	// DISPLAY WIN PAGE
	
	// main overlay container
	var overlay = $('<div id="overlay">').css({
	    "width" : "100%",
	    "height" : "100%",
	    "background-color" : "rgba(0, 0, 0, 0.6)",
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

	var winner = $('<h1 id="winner">').css({
		"margin-top" : "60px",
		"margin-bottom" : "-40px",
		"font-size" : "48px",
		"font-style" : "italic",
		"text-shadow" : "1px 0 black",
		"color" : "#ffffff"
	}).html("NICE!!<br><br>You won in " +
			 wintime + " and " + 
			 nummoves + " moves<br><br>Best time: " + 
			 msToMinSec(besttime) + "<br>Least moves: " +
			 leastmoves);
	$(winner).appendTo(cont);

	// overlay message
	$('<img src="' + background + '">').css({
		"zIndex" : "100",
		"margin" : "100px"
	}).insertAfter(winner);

	// END DISPLAY WIN ANIMATION
}
