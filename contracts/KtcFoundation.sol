pragma solidity  >=0.4.2;

//import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
//import "openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol";
//import "openzeppelin-solidity/contracts/math/SafeMath.sol";

/**  
* @title KtcFoundation manages a list of members with roles  
*/  
contract KtcFoundation {
	address private owner;
	modifier onlyOwner(){
		require(msg.sender == owner);
		_;
	}
	modifier onlyAdmin(){
		require( memberRole[msg.sender] == ROLE_ADMIN );
		_;
	}
	
	//List of members
	address[] public members;
	
	//A list of members
	mapping (address => uint ) public memberRole;
	
	
	//A list of roles
	uint constant ROLE_ADMIN = 1;
	uint constant ROLE_MANAGER = 2;
	uint constant ROLE_MEMBER = 3;


	constructor () public {
		owner = msg.sender;
		members.push(owner);
		memberRole[owner] = ROLE_ADMIN;
	}
	
	
	function addMember( address _address ) public onlyAdmin {
		//address given is not already a member 
		require( memberRole[_address] == 0 );
		
		members.push(_address);
		memberRole[_address] = ROLE_MEMBER;
	}
	
	function removeMember( address _address ) public onlyAdmin {
		for ( uint i =0; i < members.length; i++){
			if ( members[i] == _address ){
				//if i is not the last element, "swap" with last
				if (i < members.length - 1){
					members[i] = members[members.length -1];
				}
				//remove last element
				delete members[members.length -1];
				members.length = members.length - 1;
				
				memberRole[_address] = 0;
				return;
			}
		}
	}
	
	function getMemberCount() public view returns (uint) {
		return members.length;
	}
	
	function getMember(uint _index) public view returns (address, uint ){
		address addr = members [ _index];
		return (addr, memberRole[addr] );
	}
	
	
	function changeRole(address _address, uint _role) public onlyAdmin {
		//Role must exist
		require ( _role < ROLE_MEMBER + 1 );
		//_address must be a member
		require ( memberRole[ _address ] > 0 );
		memberRole[_address] = _role;
	}
	
	function getRole( address _address ) public view returns (uint) {
		return memberRole[ _address ];
	}
}