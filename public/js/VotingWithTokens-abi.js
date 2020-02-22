var voting_abi =  [
    {
      "constant": true,
      "inputs": [],
      "name": "LOCK_PERIOD",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function",
      "signature": "0x1820cabb"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "VOTE_PERIOD",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function",
      "signature": "0xa2facc29"
    },
    {
      "inputs": [
        {
          "name": "_membershipContract",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "constructor",
      "signature": "constructor"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "isAdmin",
      "outputs": [
        {
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function",
      "signature": "0xb6db75a0"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "isMember",
      "outputs": [
        {
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function",
      "signature": "0xd02982cf"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_address",
          "type": "address"
        }
      ],
      "name": "updateMembershipContract",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0xccc48940"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "getMembershipContract",
      "outputs": [
        {
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function",
      "signature": "0x3f6dd239"
    },
    {
      "constant": false,
      "inputs": [],
      "name": "toggleStatus",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0xc02857bd"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_question",
          "type": "string"
        },
        {
          "name": "_duration",
          "type": "uint256"
        }
      ],
      "name": "createPoll",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0xc7449cb7"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "getPollsCount",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function",
      "signature": "0xe0995916"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "_id",
          "type": "uint256"
        }
      ],
      "name": "getPoll",
      "outputs": [
        {
          "name": "",
          "type": "string"
        },
        {
          "name": "",
          "type": "bool"
        },
        {
          "name": "",
          "type": "uint256"
        },
        {
          "name": "",
          "type": "uint256"
        },
        {
          "name": "",
          "type": "uint256"
        },
        {
          "name": "",
          "type": "bool"
        },
        {
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function",
      "signature": "0x1a8cbcaa"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_pollId",
          "type": "uint256"
        },
        {
          "name": "_answer",
          "type": "bool"
        }
      ],
      "name": "castVote",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0x15373e3d"
    }
  ]