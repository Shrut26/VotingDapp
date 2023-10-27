const { ethers } = require("hardhat");
const hre = require("hardhat");
const fs = require("fs");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log(deployer.address);
  console.log((await deployer.getBalance()).toString());
  const balance = await deployer.getBalance();
  const Election = await hre.ethers.getContractFactory("Election");
  const election = await Election.deploy();

  await election.deployed();
  const data = {
    address: election.address,
    abi: JSON.parse(election.interface.format("json")),
  };

  //This writes the ABI and address to the mktplace.json
  fs.writeFileSync("./Election.json", JSON.stringify(data));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
