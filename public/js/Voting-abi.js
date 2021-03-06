var voting_abi =[
    {
      "inputs": [
        {
          "name": "_foundationContract",
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
      "name": "getUserRole",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function",
      "signature": "0xbf04a10d"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_question",
          "type": "bytes32"
        }
      ],
      "name": "createPoll",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0xc6befedf"
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
          "type": "bytes32"
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