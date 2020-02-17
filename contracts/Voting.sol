pragma solidity  >=0.4.17;

import "./KtcFoundation.sol";


/**  
* @title Voting app allowing foundation members to open votes and vote  
*/  
contract Voting {
	address private foundationContract;
	bool private enabled;
	address private owner;
	
	modifier onlyOwner(){
		require (msg.sender == owner );
		_;
	}
	
	modifier onlyAdmin(){
		require( getUserRole() == ROLE_ADMIN, "Unauthorized action");
		_;
	}
	modifier onlyManager(){
		require( getUserRole() >= ROLE_MANAGER, "Unauthorized action");
		_;
	}
	modifier onlyMember(){
		require( getUserRole() >= ROLE_MEMBER, "Unauthorized action");
		_;
	}
	
	
	constructor (address _foundationContract) public {
		foundationContract = _foundationContract;
		owner = msg.sender;
		enabled = true;
	}
	
	struct Poll
    {
        bytes32 question;
		uint256 deadline;
		uint yes;
		uint answers;
		uint majority;
		mapping (address => bool) hasVoted;
    }
	
	//A list of roles
	uint constant ROLE_ADMIN = 3;
	uint constant ROLE_MANAGER = 2;
	uint constant ROLE_MEMBER = 1;
	
	Poll[] polls;
	
	/**
	 * @notice Get msg sender role from the foundation contract
	 */
	function getUserRole() public view returns (uint) {
		return KtcFoundation(foundationContract).getRole(msg.sender);
	}
	
	/**
	 * @notice Update the foundation contract address in case if foundation update
	 */
	function updateFoundation(address _address) public onlyOwner {
		foundationContract = _address;
	}	
	
	/**
	 * @notice Creates a new poll
	 * @param _question The poll question
	 * For now simple questions with yes/no answers only
	 * Deadline can't be changed (will be set to 2 weeks)
	 */
	function createPoll( bytes32 _question ) public onlyManager {
		uint majority = KtcFoundation(foundationContract).getMemberCount() / 2 + 1;
		
		Poll memory p = Poll({ 
			question: _question,
			deadline: block.number + 5,
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
	function getPoll(uint _id) public view returns ( bytes32, uint, uint, uint, uint, bool, address ){
		Poll memory p = polls[_id];
		bool hasVoted = polls[_id].hasVoted[msg.sender];
		return (p.question, p.deadline, p.answers, p.yes, p.majority, hasVoted, msg.sender);
	}
	
	/**
	 * @notice Vote in a polls
	 * @param _pollId Id of the poll
	 * @param _answer A boolean meaning yes/no answer
	 */
	function castVote(uint _pollId, bool _answer) public onlyMember{
		Poll storage p = polls[_pollId];
		// poll exists and isn't closed
		require ( p.deadline > block.number );
		require ( p.hasVoted[msg.sender] == false );
		
		p.answers += 1;
		if (_answer == true) p.yes += 1;
		p.hasVoted[msg.sender] = true;
	}
}