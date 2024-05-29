// migrations/2_deploy_contracts.js
const Ballot = artifacts.require("Ballot");

module.exports = function (deployer) {
    const candidateNames = ["Alice", "Bob", "Charlie"];
    deployer.deploy(Ballot, candidateNames.map(name => web3.utils.asciiToHex(name)));
};
