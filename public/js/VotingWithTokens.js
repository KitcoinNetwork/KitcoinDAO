var votingContract;
var userAccount;
var myRole = 3;

var contractAddress;
var ENV = "prod";
var myAccount ;


var maxGas = 4900000;
window.addEventListener('load', async () => {
    if (window.ethereum) {
            window.web3 = new Web3(ethereum);
            try {
                // Request account access if needed
                await ethereum.enable();
                // Acccounts now exposed
                web3.eth.sendTransaction({/* ... */});
            } catch (error) {
                // User denied account access...
            }
	}
        // Legacy dapp browsers...
	else if (typeof web3 !== 'undefined') {
        console.log('Web3 Detected! ' + web3.currentProvider.constructor.name)
        window.web3 = new Web3(web3.currentProvider);
    } else {
        console.log('No Web3 Detected... using HTTP Provider')
		if (ENV == "dev")	window.web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"));
        else window.web3 = new Web3(new Web3.providers.HttpProvider("http://47.244.152.188/zlMOcq5cppnTUPlMz5wUCOK9udioH7LG"));
        //else window.web3 = new Web3(new Web3.providers.HttpProvider("http://47.244.57.196/")); //test server
    }
	//web3.eth.getAccounts(console.log);
	console.log(web3.version);
	
	if (ENV == "dev"){
		contractAddress = "0x3C25e63ea4Dc5941A9eA0d9b95BcB3Aea5Ae3a52";
		myAccount = web3.eth.accounts[0];
	}
	else {
		contractAddress = "0x14944Ec6A7C75E76A1595E3D581997D30ed4380a";
		myAccount = web3.eth.accounts[0];
	}
	console.log(myAccount);
	myRole = 3;
	connectContract();
	updatePage();
})


function fromHex(hex){
	var str;
	
  try{
    str = decodeURIComponent(hex.substr(2).replace(/(..)/g,'%$1'))
  }
  catch(e){
    str = hex
    console.log('invalid hex input: ' + hex)
  }
  return str.replace(/\0+$/, '').replace(/ /g,'_');
}


function toHex(str){
	var hex;
	if ( /^0x/.test(str) && str.length == 66) return str.substr(0,66);
  try{
    hex = unescape(encodeURIComponent(str.replace(/_/g,' ')))
    .split('').map(function(v){
      return v.charCodeAt(0).toString(16)
    }).join('')
  }
  catch(e){
    hex = str
    console.log('invalid text input: ' + str)
  }
  var pad ="000000000000000000000000000000000000000000000000000000000000000000";
  return "0x" + hex + pad.substring(0, pad.length - hex.length - 2) 

}





function connectContract(){
	if ( votingContract == null ){
		var contractABI = voting_abi;
		votingContract = web3.eth.contract(contractABI).at(contractAddress);
	}
}
	


function updatePage() {
	//connectContract();
	votingContract.getMembershipContract( function(err, res){
		if (err){
			console.log(err);
		}
		else {
			var membershipContractAddr = res;
			var membershipABI = membership_abi;
			membershipContract = web3.eth.contract(membershipABI).at(membershipContractAddr);
			membershipContract.balanceOf(myAccount, function(err, myBalance){
				can_vote = false;
				if (myBalance > 0) can_vote = true;
				
				updateVotingList(can_vote);
			});
		}
	});
}



function promiseGetPoll(pool_id, can_vote) {
	return function (err, poll) {
		console.log(poll);
		question = fromHex(poll[0]);
		is_open = poll[1];
		answers = poll[2];
		yes = poll[3];
		majority = poll[4];
		has_voted = poll[5];
		no = answers - yes;
		not_answered = 10000 - yes - no;

		pollString = '<div class="dashboard-container" ><p style="border-bottom: 1px solid lightgrey;">'+question+'</p>';

		if ( ! has_voted && can_vote && is_open){
			pollString += "<a href='#' onclick='castVote(true, "+pool_id+")'>Yes</a> - <a href='#' onclick='castVote(false, "+pool_id+")'>No</a>"
		}
		else {
			percent_yes = 100 *  yes / answers;
			percent_no = 100 *  no / answers;
			pollString += '<p style="font-size: 2rem;"><span  style="color: #dc3545;">是: '+yes+'</span> - <span  style="color: #007bff;">否:'+no+'</span> - 没回答: '+not_answered+'</p><div class="progress"><div class="progress-bar bg-danger" role="progressbar" style="width:'+percent_yes+'%;"><span class="progressbarvote">'+yes+'</span></div></div>';
		}

		$('#pollsList').append(pollString);
		return "toto";
	};
}

function updateVotingList( can_vote ) {
	$('#pollsList').empty();
	/* Updating network status: masternode numbers */
	votingContract.getPollsCount(function (err, memc) {
		$("#pollsNumber").text(memc);
		
		
		for ( pollIndex = memc - 1; pollIndex >= Math.max(0, memc - 5); pollIndex--){
			votingContract.getPoll(pollIndex, {from: myAccount, gas: maxGas}, promiseGetPoll(pollIndex, can_vote) );
		}
	});

}


function submitNewPoll(){
	var duration = 3600 * 24 * 15;
	votingContract.createPoll( toHex( $('#questionInput').val() ), duration, {from: myAccount, gas: maxGas}, function (err, res) {
		if (err) {
			console.log(err);
			$('#logs').append("<p>"+err+"</p>");
		} else {
			updateVotingList(true);
		}
	});
}

/**
 * @notice Cast vote (yes/no)=(true/false)
 */
function castVote(boolVote, pollId){
	votingContract.castVote( pollId, boolVote, {from: myAccount, gas: maxGas}, function (err, res) {
		if (err) {
			console.log(err);
			$('#logs').append("<p>"+err+"</p>");
		} else {
			console.log("Cast a "+boolVote+" on poll "+pollId);
			updateVotingList(true);
		}
	});
}