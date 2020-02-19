var tokenContract;
var userAccount;
var myRole = 3;
var maxGas = 4900000;

var contractAddress;
var ENV = "prod";
var myAccount ;

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
        if (ENV == "dev") window.web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"));
        else window.web3 = new Web3(new Web3.providers.HttpProvider("http://47.244.152.188/zlMOcq5cppnTUPlMz5wUCOK9udioH7LG"));
    }
	//web3.eth.getAccounts(console.log);
	console.log(web3.version);

	if (ENV == "dev"){
		contractAddress = "0x303D5B8e28196bfcB9A7b65324E1592E07DF98AA";
		myAccount = web3.eth.accounts[0];
	}
	else {
		contractAddress = "0x505505D056Bfd7F26184CF1de63562d7f7C3281E";
		myAccount = web3.eth.accounts[0];
	}
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
	if ( tokenContract == null ){
		var contractABI = membership_abi;
		foundationContract = web3.eth.contract(contractABI).at(contractAddress);
		
		/*foundationContract.getRole(myAccount, function(err, res){
			myRole = res;
		});*/
	}
}
	


function updatePage() {
	//connectContract();
	updateNetworkStatus();
}



function updateNetworkStatus(){
	$('#membersList').empty();
	/* My token balance */
	foundationContract.balanceOf(myAccount, function (err, bal){
		if (err) console.log(err);
		else {
			$('#myTokenNumber').text(bal);
		}
	});
	
	/* Updating foundation status and members*/
	foundationContract.getMemberCount(function (err, memc) {
		$("#membersNumber").text(memc - 1);
		
		for ( memberIndex = 1; memberIndex < memc; memberIndex++){
			foundationContract.getMember(memberIndex, function (err, member) {
				addr = member;
				memberString = '<div>'+shortAdd(addr);//+" - "+toRoleString(role) ;
				//admin can change roles
				if ( myRole == 1 ){
					if ( role > 1 ) {
						roleUp = parseInt(role) - 1;
						memberString += '<a href="#" onclick="toRole(\''+addr+'\','+roleUp+');">↑</a> ';
					}
					if (role < 3){ 
						roleDown = parseInt(role) + 1;
						memberString += '<a href="#" onclick="toRole(\''+addr+'\','+roleDown+');">↓</a> ';
					}
				}
				$('#membersList').append(memberString);
				return ;
			});
		}
	});

}

function toRoleString( roleNumber){
	if ( roleNumber == 1 ) return "Member";
	else if ( roleNumber == 2 ) return "Manager";
	else return "Admin";
}

function shortAdd(address){
	return address.substr(0,8) + "..." + address.substr(32);
}



function sendTokens(){
	foundationContract.transfer( $('#addrMemberInput').val(),  $('#amountInput').val(), {from: myAccount, gas: maxGas}, function (err, res) {
		if (err) {
			console.log(err);
		} else {
			updateNetworkStatus();
		}
	});
}


function toRole(addr , roleNum){
	console.log(addr);
	console.log(roleNum);
	foundationContract.changeRole( addr, roleNum , {from: myAccount, gas: maxGas}, function (err, res) {
		if (err) {
			console.log(err);
		} else {
			updateNetworkStatus();
		}
	});
}

