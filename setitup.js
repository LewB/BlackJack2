 // SET UP FUNCTION CALLED BY index.html in <body>
function setitup() {
	// SETUP THE CARD DECK
	setupdeck();
	// SETUP THE DEALER
	setdealer();
  // SET LISTENER FOR START BUTTON
  document.getElementById("startBtn").addEventListener("click", function(e) {
    e.preventDefault();
    clearall();
    setplayers();
    shufflem();
    document.getElementById("numPlayers").disabled = true;
    document.getElementById("startBtn").disabled = true;
    document.getElementById("Dealer").className = "plr";
    document.getElementById("bets").disabled = false;
	  //document.getElementById("deal").disabled = true;
	  G_Dealer.hands[0].sayit(""); // CLEAR DEALER TEXTAREA
	  G_Dealer.hands[0].sayit("CLICK <PLACE BETS> BUTTON TO BEGIN");
  });
  // SET LISTENER FOR THE POPUP OK BUTTONS
  var okbtn1 = document.getElementById("BetOkBtn");
  okbtn1.addEventListener("click", function(e) {
    e.preventDefault();
    var dialog = document.getElementById("betget");
    dialog.close();
    betclose(this.value);
  });
  var okbtn2 = document.getElementById("NameOkBtn");
  okbtn2.addEventListener("click", function(e) {
    e.preventDefault();
    var dialog = document.getElementById("nameget");
    dialog.close();
    nameclose(this.value);
  });
  // SET LISTENER FOR THE POPUP CLOSE BUTTONS
  document.getElementById("popclose").addEventListener("click", function(e) {
    e.preventDefault();
    var dialog = document.getElementById("betget");
    dialog.close();
  });
  document.getElementById("nameclose").addEventListener("click", function(e) {
    e.preventDefault();
    var dialog = document.getElementById("nameget");
    dialog.close();
  });
}

	// SET UP DEALER
function setdealer() {

	var i = 0;
	var hstr = "";
	var tnm = "";

	G_Dealer = new Player("Dealer");
	G_Dealer.divid = "Dealer";
	G_Dealer.hands[0] = new Hand();
	G_Dealer.hands[0].msg = "dlrtxt";
	// SET UP DEALER DOM DIV IN DYNAMIC HTML
	document.getElementById("Dealer").className = "dlr";
	hstr = "<p><b>DEALER</b></p><p>\n";
	for (i = 0; i < 10; i++) {
		tnm = "DC" + (i+1);
		hstr = hstr + "<img id=\x22" + tnm + "\x22 src=\x22\x22 width=60 height=80>\n";
		G_Dealer.hands[0].slots[i] = tnm;
	}
	hstr = hstr + "<br><textarea id=\x22" + G_Dealer.hands[0].msg + "\x22 READONLY name=dealtxt rows=\x223\x22 cols=\x2250\x22></textarea>\n";
	hstr = hstr + "<b>&emsp;BANK:</b>  $<span id=\x22dlrbank\x22>0</span><br>\n";
	hstr = hstr + "<button type=\x22button\x22 id=\x22bets\x22 class=\x22stdBtn\x22>Place Bets</button>\n";
	hstr = hstr + "<br></p>\n";
	document.getElementById("Dealer").innerHTML = hstr;
	// SET PLACE BETS BUTTON LISTENER
	document.getElementById("bets").addEventListener("click", function(e) {
    e.preventDefault();
    betem();
	});
	// DISABLE PLACE BETS BUTTON UNTIL PLAYERS EXIST
	document.getElementById("bets").disabled = true;
	G_Dealer.bank = 10000;
	document.getElementById("dlrbank").innerHTML = G_Dealer.bank;
	G_Dealer.hands[0].sayit("ENTER NUMBER OF PLAYERS AND PRESS <START> BUTTON");
}

	// SET UP PLAYERS DOM DIVs DYNAMIC HTML
function setplayers() {

	var pcnt = 0;
	var i = 0;
	var j = 0;
	var rsp = "";
	var hstr = "";
	var tnm = "";

	// GET NUMBER OF PLAYERS
	rsp = document.getElementById("numPlayers").value;
	pcnt = Number(rsp);
	if ( pcnt > 5 || pcnt < 1 ) {
		pcnt = 1;
	}
	hstr = "";
	for (i = 0; i < pcnt; i++) {
		tnm = "Player" + (i+1);
		var plyr = new Player(tnm);		// NEW PLAYER OBJECT
		plyr.bank = 500;
		var phnd = new Hand();			// NEW PLAYER HAND OBJECT
		plyr.divid = "pdiv" + (i+1);	// NEW PLAYER HTML DIV
		// CREATE DYNAMIC HTML PLAYER DIV
		hstr = hstr + "<div id=\x22" + plyr.divid + "\x22 class=\x22dlr\x22>\n";
		hstr = hstr + "<p><a id=\x22pname" + i + "\x22 title=\x22Change Name\x22 class=\x22stdBtn\x22>" + tnm + "</a>";
		hstr = hstr + "<br><br>\n";
		for (j = 0; j < 10; j++) {
			phnd.slots[j] = "P" + (i+1) + (j+1);	// DEFINE SLOT DOM IDS
			hstr = hstr + "<img id=\x22" + phnd.slots[j] + "\x22 src=\x22\x22 width=60 height=80>\n";
		}
		hstr = hstr + "<br>\n";
		phnd.msg = "plrtxt" + (i+1);	// DEFINE DOM PLAYER MSG TEXTAREA
		hstr = hstr + "<textarea id=\x22" + phnd.msg + "\x22 READONLY rows=\x223\x22 cols=\x2250\x22></textarea>\n";
		hstr = hstr + "<b>&emsp;BANK:</b>  $<span id=\x22plrbank" + i + "\x22>500</span><br>\n";
		phnd.fdbtn = "fold" + (i+1);	// DEFINE DOM PLAYER SURRENDER (FOLD) BUTTON
		hstr = hstr + "<button type=\x22button\x22 id=\x22" + phnd.fdbtn + "\x22 class=\x22stdBtn\x22>Surrender</button>\n";
		phnd.btbtn = "dblbet" + (i+1);	// DEFINE DOM PLAYER BET BUTTON
		hstr = hstr + "<button type=\x22button\x22 id=\x22" + phnd.btbtn + "\x22 class=\x22stdBtn\x22>Double Down</button>\n";
		phnd.stbtn = "stay" + (i+1);	// DEFINE DOM PLAYER STICK BUTTON
		hstr = hstr + "<button type=\x22button\x22 id=\x22" + phnd.stbtn + "\x22 class=\x22stdBtn\x22>Stick</button>\n";
		phnd.htbtn = "hit" + (i+1);		// DEFINE DOM PLAYER HIT BUTTON
		hstr = hstr + "<button type=\x22button\x22 id=\x22" + phnd.htbtn + "\x22 class=\x22stdBtn\x22>Hit Me</button><br></p>\n";
		hstr = hstr + "</div><br>";
		// PUSH PLAYER AND HAND OBJECTS INTO RESPECTIVE ARRAYS
		plyr.hands.push(phnd);
		G_Players.push(plyr);
	}
	// SET THE DOM DIVs DYNAMIC HTML
	document.getElementById("Jackers").innerHTML = hstr;
	//ADD BUTTON CLICK LISTENERS FOR EACH PLAYER
	var btnid;
	for (i = 0; i < pcnt; i++) {
	    // NAME CLICK HANDLER
	    btnid = "pname" + i;
	    document.getElementById(btnid).addEventListener("click", function(e) {
        e.preventDefault();
        // GET NEW NAME
        chgname(e.target.id);
	    });
	    // SURRENDER (FOLD) BUTTON
	    btnid = G_Players[i].hands[0].fdbtn;
	    document.getElementById(btnid).value = i;
	    document.getElementById(btnid).addEventListener("click", function(e) {
        e.preventDefault();
        var plyr = e.target.value;
        foldem(plyr);
	    });
	    document.getElementById(btnid).disabled = true;
	    // DOUBLE DOWN BUTTON
	    btnid = G_Players[i].hands[0].btbtn;
	    document.getElementById(btnid).value = i;
	    document.getElementById(btnid).addEventListener("click", function(e) {
        e.preventDefault();
        var plyr = e.target.value;
        doublem(plyr);
	    });
	    document.getElementById(btnid).disabled = true;
	    // STICK BUTTON
      btnid = G_Players[i].hands[0].stbtn;
      document.getElementById(btnid).value = i;
	    document.getElementById(btnid).addEventListener("click", function(e) {
        e.preventDefault();
        plyr = e.target.value;
        stickem(plyr);
	    });
	    document.getElementById(btnid).disabled = true;
	     // HIT BUTTON
	    btnid = G_Players[i].hands[0].htbtn;
      document.getElementById(btnid).value = i;
      document.getElementById(btnid).addEventListener("click", function(e) {
        e.preventDefault();
        plyr = e.target.value;
        hitem(plyr);
      });
      document.getElementById(btnid).disabled = true;
	}
}

// THE CLEAR FUNCTION FOR RESET
function clearall() {
  // CLEAR DEALER HANDS
  if (G_Dealer) {
    G_Dealer.hands[0].clear();
  }
  // DELETE PLAYER AND HAND OBJECTS
  if (G_Players) {
    for (var i = 0; i < G_Players.length; i++) {
      G_Players[i].hands[0].clear();
      delete G_Players[i].hands[0];
      delete G_Players[i];
    }
  }
}