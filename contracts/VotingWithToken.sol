pragma solidity  >=0.4.17;

import "./MembershipToken.sol";


/**  
* @title Voting app allowing foundation members to open votes and vote  
*/  
contract VotingWithTokens {
	address private membershipContract;
	bool private enabled;
	address private owner;
	
	uint public LOCK_PERIOD = 5;
	uint public VOTE_PERIOD = 10;
	
	modifier onlyOwner(){
		require (msg.sender == owner );
		_;
	}
	
	modifier onlyAdmin(){
		require( isAdmin() == true, "Unauthorized action");
		require( enabled == true, "Contract disabled");
		_;
	}
	modifier onlyMember(){
		require( isMember() == true, "Unauthorized action");
		require( enabled == true, "Contract disabled");
		_;
	}
	
	
	constructor (address _membershipContract) public {
		membershipContract = _membershipContract;
		owner = msg.sender;
		enabled = true;
	}
	
	struct Poll
    {
        string question;
		uint256 deadline;
		uint yes;
		uint answers;
		uint majority;
		mapping (address => bool) hasVoted;
    }
	
	//A membership token threshold
	uint constant ROLE_ADMIN = 100;
	uint constant ROLE_MEMBER = 1;
	
	Poll[] polls;
	
	/**
	 * @notice Determines if user is admin
	 */
	function isAdmin() public view returns (bool) {
		return ( MembershipToken(membershipContract).balanceOf(msg.sender) >= 100 );
	}

	/**
	 * @notice Determines if user is member
	 */
	function isMember() public view returns (bool) {
		return ( MembershipToken(membershipContract).balanceOf(msg.sender) > 0 );
	}
	
	/**
	 * @notice Update the membership contract address in case of update
	 */
	function updateMembershipContract(address _address) public onlyOwner {
		membershipContract = _address;
	}
	/**
	* @notice returns membership contract address
	*/
	function getMembershipContract() public view returns (address){
		return membershipContract;
	}
	 
	/**
	* @notice Toggles the contract on/off
	*/
	function toggleStatus() public onlyOwner {
		if ( enabled == true ) enabled = false;
		else enabled = true;
	}
	
	/**
	 * @notice Creates a new poll
	 * @param _question The poll question
	 * For now simple questions with yes/no answers only
	 * Deadline can't be changed (will be set to 2 weeks)
	 */
	function createPoll( string memory _question, uint256 _duration ) public onlyAdmin {
		uint majority = MembershipToken(membershipContract).totalSupply() / 2 + 1;
		
		Poll memory p = Poll({ 
			question: _question,
			deadline: block.number + _duration,
			yes: 0,
			answers: 0,
			majority: majority
		});
		polls.push(p);
	}
	
	/**
	 * @notice Get the count of existing polls
	 */
	function getPollsCount() public view returns (uint) {
		return polls.length;
	}
	
	/**
	* @notice Get poll information
	* @param _id The id of the poll
	*/
	function getPoll(uint _id) public view returns ( string memory, bool, uint, uint, uint, bool, address ){
		Poll memory p = polls[_id];
		bool hasVoted = polls[_id].hasVoted[msg.sender];
		return (p.question, p.deadline >= block.number, p.answers, p.yes, p.majority, hasVoted, msg.sender);
	}
	
	/**
	 * @notice Vote in a polls
	 * @param _pollId Id of the poll
	 * @param _answer A boolean meaning yes/no answer
	 */
	function castVote(uint _pollId, bool _answer) public onlyMember{
		Poll storage p = polls[_pollId];
		// poll exists and isn't closed
		require ( p.deadline > block.number , "Vote closed");
		require ( p.hasVoted[msg.sender] == false, "Already voted" );
		
		uint userWeight = MembershipToken(membershipContract).balanceOf(msg.sender);
		
		p.answers += userWeight;
		if (_answer == true) p.yes += userWeight;
		p.hasVoted[msg.sender] = true;
		MembershipToken(membershipContract).lockUntil(msg.sender, block.number + LOCK_PERIOD);
	}
	
	/**
	 * @notice Change the lock time for a vote
	 */
	 
}