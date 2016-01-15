// BlackJack2 V2.0
"use strict";

// CARD VALUES
var G_Values = [11,2,3,4,5,6,7,8,9,10,10,10,10];
// CARD SUIT NAMES
var G_Suits = ["Spades", "Hearts", "Diamonds", "Clubs"];
// CARD FACE NAMES
var G_Names = ["Ace", "Deuce", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Jack", "Queen", "King"];

// THE CARD OBJECT
function Card() {
	this.name = "";			// THE CARD NAME - eg. "ACE"
	this.face = "";			// THE CARD FACE IMAGE
	this.suit = "";			// THE CARD SUIT
	this.value = 0;			// THE CARD VALUE
}
// THE HAND OBJECT
function Hand() {
	// PROPERTIES
	this.divid = "";		// DOM HAND DIV ID
	this.nxtcard = 0;		// THE NEXT OPEN SLOT
	this.handtot = 0;		// THE POINT TOTAL FOR THE HAND
	this.slots = [];		// CARD SLOT DOM IDS (10)
	this.cards = [];		// THE CARDS IN THE HAND
	this.fdbtn = "";		// THE SURRENDER BUTTON DOM ID
	this.btbtn = "";		// THE DOUBLE DOWN BUTTON DOM ID
	this.htbtn = "";		// THE HIT BUTTON DOM ID
	this.stbtn = "";		// THE STICK BUTTON DOM ID
	this.spbtn = "";		// THE SPLIT HAND BUTTON DOM ID
	this.msg = "";			// THE TEXTAREA DOM ID
	this.bet = 0;			// BET FOR CURRENT HAND
	this.status = 0;		// 0 = Playing, 1 = Sticking, 2 = Busted, 3 = Blackjack, 4 = Surrender, 5 = Doubled
}
// HAND OBJECT METHODS
// clear method
Hand.prototype.clear = function() {
	// Clear all hand data (NOT HTML DOM items - slots, textarea and button IDs)
	this.handtot = 0;
	this.status = 0;
	for (var i = 0; i < this.slots.length; i++) {
		document.getElementById(this.slots[i]).src = "";
	}
	this.nxtcard = 0;
	this.cards = [];
	//document.getElementById(this.divid).InnerHTML = "";
}
// sayit method
Hand.prototype.sayit = function(what) {
	// Display text in the DOM textarea
	var txt = document.getElementById(this.msg);
	if (what != "") {
		// Display contents of the "what" string parameter
		if (txt.value != "") {
		  txt.value += "\n" + what;
		}
		else {
		  txt.value = what;
		}
		txt.scrollTop = txt.scrollHeight;
	} else {
		// Clear the textarea
		txt.value = "";
	}
}
// dealcard method
Hand.prototype.dealcard = function() {
	// Deal a card off the bottom of the global card deck
	var card = G_Deck[G_Seqx.pop()];	// Get next item from shuffled index to global card deck array
	this.handtot += card.value;			// Add card value to hand total
	document.getElementById(this.slots[this.nxtcard]).src = card.face;	// Set DOM slot id element to card face image
	// Make a copy of the dealt card
	var ncd = new Card();
	ncd.name = card.name;
	ncd.face = card.face;
	ncd.suit = card.suit;
	ncd.value = card.value;
	this.cards.push(ncd);				// Add dealt card copy to hand's card object array
	this.nxtcard++;						  // Set nxtcard index to the next available slot
	if (G_Seqx.length < 1) {    // REMAINING CARD CHECK
	  this.sayit("OUT OF CARDS - SHUFFLING NEW DECK.");
	  shufflem();
	}
}
// THE PLAYER OBJECT
function Player(pname) {
	this.name = pname;		// Player name
	this.divid = "";		// DOM Player DIV ID
	this.acthand = 0;		// Active hand
	this.hands = [];		// USE this.hands.push(new Hand)
	this.bank = 0;			// PLAYER BANK
}
// GLOBAL VARIABLE AREA
var G_Dealer;		    // DEALER (JUST ANOTHER PLAYER)
var G_Players = [];	// PLAYERS - USE G_Players.push(new Player(player_name))
var G_Hot = 0;	  	// CURRENT ACTIVE PLAYER
var G_Deck = [];  	// CURRENT SHUFFLED DECK
var G_Seqx = [];	  // THE CARD DECK SEQUENCE ARRAY
					          // Each item in array is and index to the card deck
					          // which is composed of G_Deck image array and the
					          // G_Values value array. Aces are treated as 11 initially.

// FUNCTION DEFINITION AREA

// FUNCTION setupdeck() - ONLY CALLED ONCE IN SETUP TO INITIALIZE DECK OF CARDS
function setupdeck() {
	// LOAD GLOBAL CARD DECK ARRAY: G_Deck
	// This deck is initialized once and is never altered - a sequential array G_Seqx
	// is created as part of the shufflem() function with 1-52 as references to the
	// global array G_Deck.  The G_Seqx array is randomized (shuffled) and then the
	// indexed elements are "popped" off the array as pointers to card objects in
	// the global G_Deck array which are set as card objects in the hand's "cards" array.

	var img = 0;	// Index to global card images array
	G_Deck = [];
	for (var i = 0; i < G_Suits.length; i++) {		// FOR EACH SUIT
		for (var j = 0; j < G_Values.length; j++) {	// FOR EACH VALUE
			var card = new Card();
			card.suit = G_Suits[i];
			card.name = G_Names[j];
			card.value = G_Values[j];
			card.face = G_Card_Pfx + G_Faces[img++];
			G_Deck.push(card);
		}
	}
	// NO JOKERS IN THIS DECK
}

// FUNCTION shufflem()
function shufflem() {
	// CLEAR, RELOAD AND SHUFFLE SEQUENTIAL CARD DECK INDEX GLOBAL ARRAY G_Seqx
    var counter, temp, rtmp, index, stp;

	G_Seqx = [];
	for (var i = 0; i < G_Deck.length; i++) {		// RELOAD ARRAY POINTERS
		G_Seqx.push(i);								// 1 to length of G_Deck (52)
	}
	counter = G_Seqx.length;
	while (--counter > 0) {							// Shuffle G_Seqx pointer array
		index = counter;
		stp = 0;
		// Pick a random index
		// Fisher-Yates plus my own twist to create truly random random series
		while (index == counter && stp < 10) {
				index = Math.floor(Math.random() * (counter + 1));
			stp++;
		}
		// And swap the last element with it
		temp = G_Seqx[counter];
		G_Seqx[counter] = G_Seqx[index];
		G_Seqx[index] = temp;
	}
	// CREATES RANDOM ARRAY 1-52 REPRESENTING SHUFFLED INDEX TO CARD DECK
	// POP EACH ARRAY ELEMNT FROM G_Seqx FOR RANDOM INDEX TO G_Deck
}
// HTML BUTTON FUNCTION dealem()
function dealem(){
	// CALLBACK FOR DEALER BUTTON: <button type="button" id="deal" onclick="dealem()">Deal Cards</button>
	var GDH, GPH;
	var card;
	var i = 0;
	var j = 0;

  GDH = G_Dealer.hands[0];
	// CLEAR DEALER HAND AND SLOTS
	GDH.clear();
	// CLEAR PLAYER SLOTS
	for (i = 0; i < G_Players.length; i++) {
		for (j = 0; j < G_Players[i].hands.length; j++) {
			G_Players[i].hands[j].clear();
		}
	}
	// DEAL LOGIC GOES HERE //
	// First 2 Cards to Dealer
	GDH.dealcard();
	document.getElementById(GDH.slots[0]).src = G_Card_Back;	// Show card back for 1st down card
	GDH.dealcard();
	document.getElementById("Dealer").className = "dlr";	// SET BORDER TO NONE
	if (GDH.handtot == 21 ) {
		GDH.status = 3;										  // GOT BLACKJACK
	}
	if (GDH.handtot == 22) {							// Got 2 Aces
		GDH.cards[0].value = 1;							// Make one Ace a value of 1
		GDH.handtot -= 10;
	}
	// Deal Players 2 Cards
	for (i = 0; i < G_Players.length; i++) {			// Main Player Loop
	  GPH = G_Players[i].hands[0];
		if (G_Players[i].acthand >= 0) {				// Deal to Active Players Only
			GPH.dealcard();
			GPH.dealcard();
			// CHECK FOR BLACK JACK AND ACES AND SPLITS
			if (GPH.handtot == 21) {
				GPH.sayit("*** B L A C K J A C K ! ***");
				GPH.status = 3;				// STICK
			}
			if (GPH.cards[0].name == GPH.cards[1].name) {
				// SPLIT HANDS
				
			}
			if (GPH.handtot == 22) {		// Got 2 Aces
				GPH.cards[0].value = 1;		// Make one Ace a value of 1
				GPH.handtot -= 10;			// Do this or split into two hands
			}
		}
		// SET BUTTONS AND BORDER
		document.getElementById(GPH.fdbtn).disabled = true;				// DISABLE SURRENDER BUTTON
		document.getElementById(GPH.btbtn).disabled = true;				// DISABLE DOUBLE BUTTON
		document.getElementById(GPH.stbtn).disabled = true;				// DISABLE STICK BUTTON
		document.getElementById(GPH.htbtn).disabled = true;				// DISABLE HIT BUTTON
		document.getElementById(GPH.spbtn).disabled = true;				// DISABLE SPLIT BUTTON
		document.getElementById(G_Players[i].divid).className = "dlr";	// SET BORDER TO NONE
	}
	// TO SET INITIAL NEXT PLAYER TO START CHECK AT INDEX ZERO
	G_Hot = -1;
	i = set_next_player();
	if (i < G_Players.length) {
	  GDH.sayit("");
	  GDH.sayit("Hey " + G_Players[i].name + ", Wanna Card?");
	}
}
// BUTTON FUNCTION betem()
function betem() {
  var GDH;
  var GPH;
  // GET PLAYER BETS - ANTE UP!
  GDH = G_Dealer.hands[0];

	for (var i = 0; i < G_Players.length; i++) {
		GPH = G_Players[i].hands[0];
		if (G_Players[i].acthand >= 0 && GPH.bet == 0) {
		  GDH.sayit(G_Players[i].name + " PLACE YOUR BET.");
		  // GET PLAYERS BET
	    betopen(i);
	    return;
		}
	}
	// ALL BETS IN - SET BUTTON FOR NEXT HAND
	document.getElementById("bets").disabled = true;		// DISABLE BETS BUTTON
  // DEAL NEW HANDS
	dealem();
}
// BUTTON FUNCTION betopen()
function betopen(cplr) {
	// FUNCTION TO PROMPT FOR EACH PLAYERS BETS
	// A ZERO BET CAUSES A PLAYER TO BE INACTIVE FOR THAT HAND

	if (cplr < G_Players.length) {
		var GPH = G_Players[cplr].hands[0];

		document.getElementById("plynm").innerHTML = G_Players[cplr].name;
		// SET THE VALUE OF THE OK BUTTON TO THE PLAYER INDEX
		document.getElementById("BetOkBtn").value = cplr;
		GPH.bet = 0;
		// POP UP MODAL DIALOG TO GET THE PLAYER'S BET
		var dialog = document.getElementById("betget");
		dialog.showModal();
	}
}
// BUTTON FUNCTION betclose()
function betclose(cplr) {
	// FUNCTION TO SET PLAYERS BETS CALLED FROM DIALOG CLOSE
	// cplr SET FROM DIALOG CLOSE EVENT USING VALUE IN OK BUTTON
	// A ZERO BET CAUSES A PLAYER TO BE INACTIVE FOR THAT HAND
  var GPH;
	var rsp = "";
	var bet = 0;

	if (cplr < G_Players.length) {
		var GPH = G_Players[cplr].hands[0];
		// GET THE PLAYER'S BET
		rsp = document.getElementById("retval").value;
		document.getElementById("retval").value = "";
		if ( rsp ) {
			bet = Number(rsp);
			if ( bet > 0 ) {
				GPH.bet = bet;
			}
		} else {
		  GPH.bet = 50;
		}
		if ( GPH.bet < 50 ) {
			// NO BET - SITTING OUT HAND
			GPH.sayit("*** Player Sitting This Hand Out ***");
			GPH.bet = 0;
			G_Players[cplr].acthand = -1;
		} else {
			// PLAYING A HAND
			G_Players[cplr].acthand = 0;
			GPH.sayit("");
			GPH.sayit(G_Players[cplr].name + "'s Bet is: " + GPH.bet);
		}
	}
	// CHECK FOR NEXT PLAYER AND BET ACCORDINGLY
	betem();
}
// BUTTON FUNCTION chgname()
function chgname(trgid) {
	// FUNCTION TO PROMPT FOR NEW PLAYER NAME
	// SET THE VALUE OF THE OK BUTTON TO THE PLAYER INDEX
	document.getElementById("NameOkBtn").value = trgid;
	// CLEAR NAME INPUT FIELD
	document.getElementById("chgname").value = "";
	// POP UP MODAL DIALOG TO GET THE PLAYER'S NAME
	var dialog = document.getElementById("nameget");
	dialog.showModal();
}
// BUTTON FUNCTION nameclose()
function nameclose(trgid) {
	// FUNCTION TO SET PLAYERS NAME CALLED FROM DIALOG CLOSE
	// trgid SET FROM DIALOG CLOSE EVENT USING VALUE IN OK BUTTON

  // GET THE PLAYERS INDEX
  var iLen = String(trgid).length;
  var cplr = Number(String(trgid).substring(iLen, iLen - 1));
	// GET THE PLAYER'S NAME
	var rsp = document.getElementById("chgname").value;
	document.getElementById("chgname").value = "";
	if ( rsp && cplr >= 0 && cplr < G_Players.length) {
		G_Players[cplr].name = rsp;
		document.getElementById(trgid).innerHTML = rsp;
	}
  else {
    console.log("nameclose: Bad Player Index in Change Name.");
  }
}
// BUTTON FUNCTION foldem()
function foldem(cplr) {
	// CALLBACK FOR PLAYER SURRENDER BUTTON DYNAMIC HTML:
	// <button type="button" id="foldX onclick="foldem(X)>Surrender</button>
	// Where: X = The Player Number (dynamically generated in setitup() function)
	var GPH = G_Players[cplr].hands[0];

	GPH.sayit("Player Surrendered Hand.");
	GPH.bet = (GPH.bet / 2) | 0;
	GPH.handtot = 0;
	GPH.status = 4;
	set_next_player();
}
// BUTTON FUNCTION doublem()
function doublem(cplr) {
  // CALLBACK FOR PLAYER DOUBLE DOWN BUTTON DYNAMIC HTML:
	// <button type="button" id="dblbetX" onclick="doublem(X)">Double Down</button>
  var GPH = G_Players[cplr].hands[0];

  GPH.bet *= 2;           // DOUBLE DOWN
  GPH.sayit(G_Players[cplr].name + "'s Bet DOUBLED to: " + GPH.bet);
  GPH.status = 5;         // SET STATUS TO DOUBLED
  G_Dealer.hands[0].sayit(G_Players[cplr].name + " has Doubled Down.");
  hitem(cplr);            // GET LAST CARD DOUBLE DOWNED ON AND STICK
}
// BUTTON FUNCTION stickem()
function stickem(cplr){
	// CALLBACK FOR PLAYER SURRENDER BUTTON DYNAMIC HTML:
	// <button type="button" id="stayX onclick="stickem(X)">Surrender</button>
	// Where: X = The Player Number (dynamically generated in setitup() function)
	if (cplr < G_Players.length) {
		var GPH = G_Players[cplr].hands[0];
		GPH.status = 1;
		GPH.sayit(G_Players[cplr].name + " Sticks.");
		set_next_player();
	}
}
// BUTTON FUNCTION hitem()
function hitem(cplr) {
	// CALLBACK FOR PLAYER HIT BUTTON DYNAMIC HTML:
	// <button type="button" id="hitX onclick="hitem(X)>Surrender</button>
	// Where: X = The Player Number (dynamically generated in setitup() function)
	var i, slot, card;
	var GPH;

	GPH = G_Players[cplr].hands[0];
	// GET A CARD
	if (GPH.nxtcard >= GPH.slots.length) {
		// NO SLOTS LEFT
		GPH.sayit("OUT OF SLOTS.");
		set_next_player();
		return;
	}
	if (GPH.handtot == 21) {
		GPH.sayit("YOU'RE AT TWENTY-ONE! Stick or Wait for the Next Hand.");
		set_next_player();
		return;
	}
	if (GPH.status == 2) {
		GPH.sayit("YOU'RE BUSTED! Deal Another Hand.");
		set_next_player();
		return;
	}
	if (GPH.status == 1) {
		GPH.sayit("YOU HAVE ALREADY STAYED! Wait for the Next Hand.");
		set_next_player();
		return;
	}
	// POP THE NEXT CARD AND PUT IT IN THE OPEN SLOT
	GPH.dealcard();
	// CHECK FOR BUST
	if (GPH.handtot > 21) {
		for (i = 0; i < GPH.nxtcard; i++) {
			if (GPH.cards[i].value == 11) {
				// USE ACES LOW IN HAND
				GPH.sayit("Making " + GPH.cards[i].name + " of " + GPH.cards[i].suit + " value 1.");
				GPH.cards[i].value = 1;
				GPH.handtot -= 10;
				if (GPH.handtot <= 21) {
					// THAT ACE WAS ENOUGH
					break;
				}
			}
		}
		if (GPH.handtot > 21) {			// NO ACES FOUND
			document.getElementById(GPH.slots[0]).src = GPH.cards[0].face;
			GPH.status = 2;				// BUSTED!
		}
	}
	if (GPH.handtot == 21) {			// NOT BLACKJACK - MORE THAN 2 CARDS
		GPH.status = 1;					// STICK
	}
	document.getElementById(GPH.fdbtn).disabled = true;		// DISABLE SURRENDER BUTTON
	document.getElementById(GPH.btbtn).disabled = true;		// DISABLE DOUBLE BUTTON
	if (GPH.status > 0) {
		set_next_player();
	}
}
// BUTTON FUNCTION splitem()
function splitem(cplr){
	// CALLBACK FOR PLAYER SURRENDER BUTTON DYNAMIC HTML:
	// <button type="button" id="stayX onclick="splitem(X)">Split Hand</button>
	// Where: X = The Player Number (dynamically generated in setitup() function)
	if (cplr < G_Players.length) {
		var GPH = G_Players[cplr].hands[0];
		GPH.status = 1;
		GPH.sayit(G_Players[cplr].name + " Sticks.");
		set_next_player();
	}
}
// FUNCTION play_dealer()
function play_dealer() {
	// CALLED WHEN ALL PLAYERS ARE BUSTED, OR STICKING
	var i, j, slot, card;
	var pmax = 0;
	var winner = "";
	var txt = {};

	// DEALER HAS TO AUTOMATICALLY PLAY OUT THE HAND NOW
	var GDH = G_Dealer.hands[0];
	document.getElementById(GDH.slots[0]).src = GDH.cards[0].face;	// SHOW DEALER DOWN CARD
	if (GDH.nxtcard <= 2 && GDH.cards[0].value == 11 && GDH.cards[1].value == 11) {
		// BOTH 2 FIRST CARDS ACES - USE ONE AS LOW ACE
		GDH.sayit("Making " + GDH.cards[0].name + " of " + GDH.cards[0].suit + " value 1.");
		GDH.cards[0].value = 1;
		GDH.handtot -= 10;
	}
	while (GDH.handtot < 17 && GDH.nxtcard < GDH.slots.length) {
		if (G_Seqx.length < 1) {
			shufflem();
		}
		GDH.dealcard();
		if (GDH.handtot > 21)		// CHECK FOR ACES
		{
			for (i = 0; i < GDH.nxtcard; i++) {
				if (GDH.cards[i].value == 11) {	// HIGH ACE IN HAND
					GDH.sayit("Making " + GDH.cards[i].name + " of " + GDH.cards[i].suit + " value 1.");
					GDH.cards[i].value = 1;		// MAKE IT A LOW ACE
					GDH.handtot -= 10;
					if (GDH.handtot <= 21) {
						// ONE ACE IS ENOUGH
						break;
					}
				}
			}
		}
	}
	GDH.sayit("TOTAL: " + parseInt(GDH.handtot));
	// CHECK FOR WINNING PLAYER HANDS
	if (GDH.status == 3) {
			GDH.sayit("*** BLACKJACK - HOUSE WINS! ***");
	} else {
		if (GDH.handtot > 21) {
			GDH.sayit("*** BUSTED ***");
			GDH.status = 2;
			GDH.handtot = 0;
		} else {
			GDH.status = 1;
		}
	}
	// PAY OFF BETS
	for (i = 0; i < G_Players.length; i++) {
		if (G_Players[i].acthand >= 0 ) {
			for (j = 0; j < G_Players[i].hands.length; j++) {
				var GPH = G_Players[i].hands[j];
				// If ((Dealer BJ AND Player BJ)
			  //    OR (Player Busted AND Dealer Busted)
			  //    OR (Player total EQUALS Dealer Total AND Dealer Stayed AND (Player Stayed OR Player Doubled)))
				if ((GPH.status == 3 && GDH.status == 3)
							|| (GPH.status == 2 && GDH.status == 2)
							|| (GPH.handtot == GDH.handtot && GDH.status == 1 && (GPH.status == 1 || GPH.status == 5))) {
					// Then PUSH
					GDH.sayit("*** PLAYER " + G_Players[i].name + " PUSH ***");
				} else {
				// If ((Dealer NOT BJ AND Player BJ)
			  //    OR ((Player Stayed OR Player Doubled) AND Dealer Stayed AND Player Total GT Dealer Total)
			  //    OR (Player NOT Busted AND Player NOT Surrendered AND Dealer Busted))
					if ((GDH.status != 3 && GPH.status == 3)
								|| ((GPH.status == 1 || GPH.status == 5) && GDH.status == 1 && GPH.handtot > GDH.handtot)
								|| (GPH.status != 2 && GPH.status != 4 && GDH.status == 2)) {
						// Then PLAYER WINS
						if (GPH.status == 3) {	// BLACK JACK HAND! (21 WITH 2 CARDS)
							GPH.bet = GPH.bet * 1.5;
						}
						G_Players[i].bank += GPH.bet;
						GDH.sayit("*** PLAYER " + G_Players[i].name + " WINS $" + GPH.bet + "! ***");
						G_Dealer.bank -= GPH.bet;
					} else {
						// Else HOUSE WINS
						if (GPH.status == 4) {	// PLAYER SURRENDERED
							GDH.sayit("*** PLAYER " + G_Players[i].name + " SURRENDERED $" + GPH.bet + " ***");
						} else {
							GDH.sayit("*** PLAYER " + G_Players[i].name + " LOST $" + GPH.bet + " ***");
						}
						G_Players[i].bank -= GPH.bet;
						G_Dealer.bank += GPH.bet;
					}
				}
				// SHOW ALL PLAYER HANDS
				if (GPH.handtot > 0) {
					// NOT SURRENDERED
					GPH.sayit("HAND TOTAL: " + parseInt(GPH.handtot));
				}
				if (GPH.handtot > 21) {
					GPH.sayit("*** BUSTED ***");
				}
				GPH.bet = 0; // MUST BE ZERO - OR IT WILL NOT ASK FOR NEXT BET.
			}
			var bkamt = parseInt(G_Players[i].bank);
			document.getElementById("plrbank" + i).innerHTML = bkamt;
		}
		else {
		  // CLEAR NON ACTIVE HANDS (SIT OUT ONCE)
		  G_Players[i].acthand = 0;
		}
	}
	document.getElementById("dlrbank").innerHTML = G_Dealer.bank;
	document.getElementById("bets").disabled = false;		// ENABLE BET BUTTON
	GDH.sayit("PLACE YOUR BETS - ANTE UP $50 TO PLAY...");
}
// FUNCTION set_next_player()
function set_next_player() {
	// SETS CONTROL TO THE NEXT ACTIVE PLAYER OR THE DEALER IF NO PLAYERS LEFT
	var GPH;
	var i;

	if (G_Hot >= G_Players.length) {
		// SOMETHING IS WRONG?
		return;
	}
	if (G_Hot >= 0) {
		// NOT IN INITIAL SETUP CALL
		document.getElementById(G_Players[G_Hot].divid).className = "dlr";	// SET BORDER TO NONE
		GPH = G_Players[G_Hot].hands[0];
		// MAKE SURE CARD IS DOWN AND BUTTONS ARE RESET
		document.getElementById(GPH.fdbtn).disabled = true;		// DISABLE SURRENDER BUTTON
		document.getElementById(GPH.btbtn).disabled = true;		// DISABLE BET BUTTON
		document.getElementById(GPH.stbtn).disabled = true;		// DISABLE STICK BUTTON
		document.getElementById(GPH.htbtn).disabled = true;		// DISABLE HIT BUTTON
	}
	// FIND NEXT ACTIVE PLAYER FROM CURRENT PLAYER (status = 0)
	G_Hot++;
	for (i=G_Hot; i < G_Players.length; i++) {
		if (G_Players[i].acthand >= 0) {
			GPH = G_Players[i].hands[0];
			if (GPH.status == 0) {
				break;
			}
		}
	}
	if (i >= G_Players.length) {
		// WENT TO END OF PLAYER ARRAY - FIND ANY ACTIVE PLAYER FROM BEGINNING OF PLAYERS ARRAY
		for (i=0; i < G_Players.length; i++) {
			if (G_Players[i].acthand >= 0) {
				GPH = G_Players[i].hands[0];
				if (GPH.status == 0) {
					break;
				}
			}
		}
	}
	if (i < G_Players.length) {
		// FOUND NEXT ACTIVE PLAYER
		G_Hot = i;
		document.getElementById(G_Players[G_Hot].divid).className = "plr";	// SET BORDER TO ON
		if (G_Dealer.hands[0].status != 3) {						        // NO DEALER BLACKJACK
			document.getElementById(GPH.fdbtn).disabled = false;	// ENABLE SURRENDER BUTTON
		}
		document.getElementById(GPH.btbtn).disabled = false;		// ENABLE BET BUTTON
		document.getElementById(GPH.stbtn).disabled = false;		// ENABLE STICK BUTTON
		document.getElementById(GPH.htbtn).disabled = false;		// ENABLE HIT BUTTON
	} else {
		// STILL NO ACTIVE PLAYERS - GO TO DEALER
		document.getElementById(G_Dealer.divid).className = "plr";	// SET BORDER TO GREEN
		play_dealer();
		i = 0;
	}
	return(i);
}
