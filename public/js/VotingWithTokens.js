var votingContract;
var userAccount;
var myRole = 3;

var contractAddress;
var ENV = "dev";
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
		contractAddress = "0x11705A836863707F83f2ca74e5b912cB7Ae4a224";
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
		deadline = poll[1];
		now = Date();
		
		console.log(deadline +0);
		deadline_date = new Date( 1000 * now * ( web3.eth.blockNumber - deadline));

		answers = poll[2];
		yes = poll[3];
		majority = poll[4];
		has_voted = poll[5];

		pollString = '<div>'+question+" - ";

		if ( ! has_voted && can_vote && deadline > web3.eth.blockNumber){
			pollString += "<a href='#' onclick='castVote(true, "+pool_id+")'>Yes</a> - <a href='#' onclick='castVote(false, "+pool_id+")'>No</a>"
		}
		else {
			percent = 100 *  yes / answers;
			pollString += '<div class="progress"><div class="progress-bar" role="progressbar" aria-valuenow="70" aria-valuemin="0" aria-valuemax="100" style="width:'+percent+'%;"><span class="progressbarvote">'+yes+' Yes</span></div><div class=""><span class="progressbarvote">'+answers+'</span></div></div>';
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
		
		
		for ( pollIndex = 0; pollIndex < memc; pollIndex++){
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
			updateVotingList();
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
			updateVotingList();
		}
	});
}