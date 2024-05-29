// app.js
const contractAddress = '0x9e837554eE84f680A45A7Ee1F7be75DF9ba682C8';
const contractABI =  [
    {
      "inputs": [
        {
          "internalType": "string[]",
          "name": "candidateNames",
          "type": "string[]"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "string",
          "name": "name",
          "type": "string"
        }
      ],
      "name": "CandidateAdded",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [],
      "name": "VoteEnded",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [],
      "name": "VoteStarted",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "voter",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "candidate",
          "type": "uint256"
        }
      ],
      "name": "Voted",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "candidates",
      "outputs": [
        {
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "voteCount",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "chairperson",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "state",
      "outputs": [
        {
          "internalType": "enum Ballot.State",
          "name": "",
          "type": "uint8"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "voters",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "weight",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "voted",
          "type": "bool"
        },
        {
          "internalType": "uint256",
          "name": "vote",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "string[]",
          "name": "candidateNames",
          "type": "string[]"
        }
      ],
      "name": "addCandidates",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "startVote",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "endVote",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "candidateIndex",
          "type": "uint256"
        }
      ],
      "name": "vote",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ];

window.addEventListener('load', async () => {
    if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        try {
            await window.ethereum.enable();
            init();
        } catch (error) {
            console.error("User denied account access");
        }
    } else {
        console.warn("No web3 provider detected");
    }
});

async function init() {
    const contract = new web3.eth.Contract(contractABI, contractAddress);
    const accounts = await web3.eth.getAccounts();
    const account = accounts[0];
    
    const candidatesDiv = document.getElementById('candidates');

    async function loadCandidates() {
        const candidateCount = await contract.methods.candidatesCount().call();
        candidatesDiv.innerHTML = '';
        for (let i = 0; i < candidateCount; i++) {
            const candidate = await contract.methods.candidates(i).call();
            const candidateElement = document.createElement('div');
            candidateElement.innerHTML = `
                <p>${candidate.name} - ${candidate.voteCount} votes</p>
                <button onclick="vote(${i})">Vote</button>
            `;
            candidatesDiv.appendChild(candidateElement);
        }
    }

    window.vote = async function(candidateIndex) {
        await contract.methods.vote(candidateIndex).send({ from: account });
        loadCandidates();
    }

    document.getElementById('start-vote').addEventListener('click', async () => {
        await contract.methods.startVote().send({ from: account });
    });

    document.getElementById('end-vote').addEventListener('click', async () => {
        await contract.methods.endVote().send({ from: account });
    });

    loadCandidates();
}
