// contracts/Ballot.sol
pragma solidity >=0.7.0 <0.9.0;
pragma abicoder v2;

contract Ballot {
    struct Voter {
        uint weight;
        bool voted;
        uint vote;
    }

    struct Candidate {
        string name;
        uint voteCount;
    }

    address public chairperson;
    mapping(address => Voter) public voters;
    Candidate[] public candidates;

    enum State {
        Created,
        Voting,
        Ended
    }
    State public state;

    event CandidateAdded(string name);
    event VoteStarted();
    event VoteEnded();
    event Voted(address indexed voter, uint candidate);

    constructor(string[] memory candidateNames) {
        chairperson = msg.sender;
        voters[chairperson].weight = 1;
        state = State.Created;

        for (uint i = 0; i < candidateNames.length; i++) {
            candidates.push(Candidate({name: candidateNames[i], voteCount: 0}));
        }
    }

    modifier onlySmartContractOwner() {
        require(
            msg.sender == chairperson,
            "Only chairperson can start and end the voting"
        );
        _;
    }

    modifier CreatedState() {
        require(state == State.Created, "It must be in Created state");
        _;
    }

    modifier VotingState() {
        require(state == State.Voting, "It must be in Voting state");
        _;
    }

    modifier EndedState() {
        require(state == State.Ended, "It must be in Ended state");
        _;
    }

    function addCandidates(
        string[] memory candidateNames
    ) public EndedState onlySmartContractOwner {
        state = State.Created;
        for (uint i = 0; i < candidateNames.length; i++) {
            candidates.push(Candidate({name: candidateNames[i], voteCount: 0}));
            emit CandidateAdded(candidateNames[i]);
        }
    }

    function startVote() public onlySmartContractOwner CreatedState {
        state = State.Voting;
        emit VoteStarted();
    }

    function endVote() public onlySmartContractOwner VotingState {
        state = State.Ended;
        emit VoteEnded();
    }

    function vote(uint candidateIndex) public VotingState {
        Voter storage sender = voters[msg.sender];
        require(sender.weight > 0, "Has no right to vote");
        require(!sender.voted, "Already voted");
        sender.voted = true;
        sender.vote = candidateIndex;

        candidates[candidateIndex].voteCount += sender.weight;
        emit Voted(msg.sender, candidateIndex);
    }
}
