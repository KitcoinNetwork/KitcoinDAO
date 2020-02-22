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
	console.log(web3.version);
	var a = await web3.eth.getAccounts();
	myAccount = a[0];
	console.log(myAccount);
	if (ENV == "dev"){
		contractAddress = "0x64f92bb40b471371fC035006Eb8Fcf8223D01a19";
	}
	else {
		contractAddress = "0x505505D056Bfd7F26184CF1de63562d7f7C3281E";
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
		foundationContract = new web3.eth.Contract(contractABI, contractAddress);
		
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
	foundationContract.methods.balanceOf(myAccount).call( function (err, bal){
		if (err) console.log(err);
		else {
			$('#myTokenNumber').text(bal);
		}
	});
	
	foundationContract.methods.getBiboAccount( myAccount).call( function(err, biboAccount){
		if (biboAccount != "")
			$('#biboAccount').text(biboAccount);
	});
	
	/* Updating foundation status and members*/
	foundationContract.methods.getMemberCount().call( function (err, memc) {
		console.log('Got members count: ' + memc);
		$("#membersNumber").text(memc - 1);
		
		for ( memberIndex = 1; memberIndex < memc; memberIndex++){
			foundationContract.methods.getMemberAndBalance(memberIndex).call( function (err, member) {
				addr = member[0];
				bal = member[1];
				memberString = '<div>'+shortAdd(addr)+" - "+bal ;
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
	foundationContract.methods.transfer( $('#addrMemberInput').val(),  $('#amountInput').val() )
		.send({from: myAccount, gas: maxGas} )
		.on('transactionHash', function(receipt){
			
		})
		.on('receipt', function(receipt){
			updateNetworkStatus();
		})
		.on('error', console.error);
}

function updateBibo(){
	var bbA = $('#biboAccountInput').val();
	if ( bbA == "" ){
		$('#biboAccountInput').addClass('is-invalid');
		return false;
	}
	else {
		$('#biboAccountInput').removeClass('is-invalid');
		$('#biboAccountInput').val('');
	}
	foundationContract.methods.registerBibo( bbA ).send({from: myAccount, gas: maxGas} )
		.on('receipt', function(receipt){
			updateNetworkStatus();
		})
		.on('error', console.error);
}
