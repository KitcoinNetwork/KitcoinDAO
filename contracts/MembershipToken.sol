pragma solidity  >=0.4.2;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20Detailed.sol";

/**  
* @title MembershipToken is an ERC20 Token with 0 decimals
*/  
contract MembershipToken is ERC20, ERC20Detailed {
	
	address private owner;
	modifier onlyOwner(){
		require(msg.sender == owner, "Require being owner");
		_;
	}
		
	//keeps track of a user's lock date (tockens can be locked after a vote to prevent multiple voting)
	mapping ( address => uint256 ) lockedUntil;
	modifier onlyUnlocked(){
		require(lockedUntil[msg.sender] <= block.number, "Funds locked");
		_;
	}
	
	/**
	* @dev keep track of token holders = members
	*/
	//first members is 0x0 because of position problem
	address[] public members;
	//position of member address in the members list
	mapping ( address => uint256 ) memberIndex;
	//bibo member Id for airdrops
	mapping ( address => string ) memberBibo;

	uint256 public constant initial_supply = 50000;  

	/**  
	* @dev assign totalSupply to account creating this contract 
	*/
	constructor()
		ERC20Detailed("JiJinHui", "JJH", 0)
		public 
	{  
		owner = msg.sender;
		_mint(owner, initial_supply * (uint256(10)**uint256(decimals())));
		members.push(address(0));
		memberIndex[owner] = members.push(owner) - 1;
	}
	
	function transfer(address recipient, uint256 amount) public onlyUnlocked returns (bool) {
		//not allowed to burn tokens
		require ( recipient != address(0) );
		
        _transfer(_msgSender(), recipient, amount);
		
		// Recipient is a new member 
		if ( memberIndex[ recipient ] == 0 ){
			memberIndex[ recipient ] = members.length;
			members.push(recipient);
		} //else: no change, recipient already in list
		
		// Sender isn't a member anymore
		if ( balanceOf(msg.sender) == 0 ){
			uint ind = memberIndex[msg.sender];

			if ( ind == members.length - 1 ){
				// if last element in list, just remove it
				delete members[ members.length -1 ]; 
			}
			else {
				//else replace by last element and pop last element out
				members [ ind ] = recipient;
				memberIndex[ msg.sender ] = 0;
				memberIndex[ recipient ] = ind;
				delete members[ members.length - 1];
			}
		}

        return true;
    }
	
	/**
	* @notice Mint or burn token
	*/
	function mint(uint256 _howMuch) public onlyOwner {
		_mint(owner, _howMuch);
	}
	function burn(uint256 _howMuch) public onlyOwner {
		_burn(msg.sender, _howMuch);
	}
	
	/**
	* @notice Returns member count
	*/
	function getMemberCount() public view returns (uint256) {
		return members.length;
	}
	/**
	* @notice Provides the Xth member of the list
	*/
	function getMember(uint256 index) public view returns (address){
		return members[index];
	}
	/**
	* @notice Provides the Xth member of the list and its coin balance in one single call
	*/
	function getMemberAndBalance(uint256 index) public view returns (address, uint256){
		return (members[index], balanceOf(members[index]) );
	}
	
	/**
	* @notice Checks if address is a member
	*/
	function isMember(address _address) public view returns (bool){
		return ( memberIndex[_address] != 0 ? true : false );
	}
	
	/**
	* @notice Locks a user funds (useful for preventing transfers after a vote)
	* Lazy dirty anone can call it until we find a way to make it safe or use Approve
	*/
	function lockUntil(address _address, uint256 _until) public {
		lockedUntil[ _address ] = _until;
	}
	
	
	/**
	* @notice Register a user's Bibo ID for future airdrops
	*/
	function registerBibo( string memory _biboID ) public {
		memberBibo[msg.sender] = _biboID;
	}
	
	/**
	* @notice Get user's Bibo account name
	*/
	function getBiboAccount(address _address)public view returns (string memory){
		return memberBibo[_address];
	}
}