const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Use real token addresses
  const CAMEP_ADDRESS = '0x068F6B14CcDE2459ed748616BFeD0cA51074c671';
  const WFCA_ADDRESS = '0xae4533189c7281501f04ba4b7c37e3aded402902';

  // Deploy SwapContract
  console.log("\nDeploying SwapContract...");
  const SwapContract = await hre.ethers.getContractFactory("SwapContract");
  const swapContract = await SwapContract.deploy(
    CAMEP_ADDRESS,
    WFCA_ADDRESS,
    12830000 // Initial WFCA price: 12.83 JPY (with 6 decimals)
  );
  await swapContract.deployed();
  console.log("SwapContract deployed to:", swapContract.address);

  console.log("\nContract Addresses:");
  console.log(`CAMEP_ADDRESS = '${CAMEP_ADDRESS}'`);
  console.log(`WFCA_ADDRESS = '${WFCA_ADDRESS}'`);
  console.log(`SWAP_CONTRACT_ADDRESS = '${swapContract.address}'`);

  // Verify contracts on Etherscan
  console.log("\nVerifying contract on Etherscan...");
  try {
    await hre.run("verify:verify", {
      address: swapContract.address,
      constructorArguments: [
        CAMEP_ADDRESS,
        WFCA_ADDRESS,
        12830000
      ],
    });
  } catch (error) {
    console.error("Verification error:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
