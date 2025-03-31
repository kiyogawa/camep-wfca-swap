const hre = require("hardhat");

async function main() {
  // Real token addresses on mainnet
  const CAMEP_ADDRESS = '0x068F6B14CcDE2459ed748616BFeD0cA51074c671';
  const WFCA_ADDRESS = '0xae4533189c7281501f04ba4b7c37e3aded402902';
  const INITIAL_WFCA_PRICE = process.env.INITIAL_WFCA_PRICE || 12910000; // 12.91 JPY with 6 decimals

  console.log("\nDeploying with the following parameters:");
  console.log(`CAMEP_ADDRESS: ${CAMEP_ADDRESS}`);
  console.log(`WFCA_ADDRESS: ${WFCA_ADDRESS}`);
  console.log(`INITIAL_WFCA_PRICE: ${INITIAL_WFCA_PRICE}`);

  // Get current gas price
  const gasPrice = await hre.ethers.provider.getGasPrice();
  console.log(`\nCurrent gas price: ${hre.ethers.utils.formatUnits(gasPrice, "gwei")} gwei`);

  // Deploy with confirmation
  console.log("\nDeploying SwapContractV2...");
  const SwapContractV2 = await hre.ethers.getContractFactory("SwapContractV2");
  const swapContract = await SwapContractV2.deploy(
    CAMEP_ADDRESS,
    WFCA_ADDRESS,
    INITIAL_WFCA_PRICE,
    {
      gasPrice: gasPrice
    }
  );

  console.log("\nWaiting for deployment transaction to be mined...");
  await swapContract.deployed();

  // Wait for 5 block confirmations
  console.log("\nWaiting for block confirmations...");
  await swapContract.deployTransaction.wait(5);
  console.log(`SwapContractV2 deployed to ${swapContract.address}`);

  // Print contract addresses
  console.log("\nContract Addresses:");
  console.log(`CAMEP_ADDRESS = '${CAMEP_ADDRESS}'`);
  console.log(`WFCA_ADDRESS = '${WFCA_ADDRESS}'`);
  console.log(`SWAP_CONTRACT_ADDRESS = '${swapContract.address}'`);

  // Verify contract deployment
  console.log("\nVerifying contract on Etherscan...");
  await hre.run("verify:verify", {
    address: swapContract.address,
    constructorArguments: [
      CAMEP_ADDRESS,
      WFCA_ADDRESS,
      INITIAL_WFCA_PRICE
    ],
  });

  // Save contract ABI
  const fs = require('fs');
  const contractArtifact = require('../artifacts/contracts/SwapContractV2.sol/SwapContractV2.json');
  
  if (!fs.existsSync('./contracts/abi')){
    fs.mkdirSync('./contracts/abi', { recursive: true });
  }
  
  fs.writeFileSync(
    './contracts/abi/SwapContractV2.json',
    JSON.stringify(contractArtifact.abi, null, 2)
  );
  console.log('\nContract ABI saved to contracts/abi/SwapContractV2.json');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
