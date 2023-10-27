require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
const fs = require("fs");

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

module.exports = {
  defaultNetwork: "hardhat",

  networks: {
    hardhat: {
      chainid: 1337,
    },
    sepolia: {
      url: "https://eth-sepolia.g.alchemy.com/v2/IIVPCQLmm3fR_cXxM2jX068gvylv40Dy",
      accounts: [
        "bd883143ad9c044d2fb610106c493987ad8ff27244cee8a9930abae32a8303df",
      ],
    },
  },

  solidity: {
    version: "0.8.9",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
};
