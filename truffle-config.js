module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545, // Make sure this matches your Ganache setup
      network_id: "*" // Match any network id
    }
  },
  compilers: {
    solc: {
      version: "0.8.0", // Fetch exact version from solc-bin
    }
  }
};
ganache-cli