var tokenContract;
var userAccount;
var myRole = 3;
var myAccount;
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
        window.web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"));
        //window.web3 = new Web3(new Web3.providers.HttpProvider("http://47.244.152.188/zlMOcq5cppnTUPlMz5wUCOK9udioH7LG"));
    }
	//web3.eth.getAccounts(console.log);
	console.log(web3.version);
	
	//TODO: run after setting contract address
	//listMyPools();
	//document.getElementById("address").value = (await web3.eth.getAccounts())[0];
	myAccount = "0x1e81F9210adD6c747CD33490cE6Ec94226532177";//web3.eth.accounts[0];
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
		//Prod address
		//var contractAddress = "0x904235d23F1CCE0bdC2163f6a490D56Ee776bf3F"
		//Dev address 
		var contractAddress = "0x64f92bb40b471371fC035006Eb8Fcf8223D01a19";
		var contractABI = foundation_abi;
		foundationContract = web3.eth.contract(contractABI).at(contractAddress);
		
		foundationContract.getRole(myAccount, function(err, res){
			myRole = res;
		});
	}
}
	


function updatePage() {
	//connectContract();
	updateNetworkStatus();
}



function updateNetworkStatus(){
	$('#membersList').empty();
	/* Updating network status: masternode numbers */
	foundationContract.getMemberCount(function (err, memc) {
		$("#membersNumber").text(memc);
		
		
		for ( memberIndex = 0; memberIndex < memc; memberIndex++){
			foundationContract.getMember(memberIndex, function (err, member) {
				addr = member[0];
				role = member[1];
				memberString = '<div>'+shortAdd(addr)+" - "+toRoleString(role) ;
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
				console.log(member[0]);
				console.log(member[1].toNumber());
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



function addMember(){
	foundationContract.addMember( $('#addMemberInput').val(), {from: myAccount, gas: maxGas}, function (err, res) {
		if (err) {
			console.log(err);
		} else {
			updateNetworkStatus();
		}
	});
}
function delMember(){
	foundationContract.removeMember( $('#delMemberInput').val(), {from: myAccount, gas: maxGas}, function (err, res) {
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

