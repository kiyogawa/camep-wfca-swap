const hre = require("hardhat");

async function main() {
  const amount = hre.ethers.utils.parseEther("100"); // 100 WFCA

  // Get contract instances
  const wfca = await hre.ethers.getContractAt("IERC20", "0xae4533189c7281501f04ba4b7c37e3aded402902");
  const swapContract = await hre.ethers.getContractAt("SwapContract", "0x05990D236C42D35F121F13C87b0C40293b9838FE");

  console.log("Approving WFCA transfer...");
  const approveTx = await wfca.approve(swapContract.address, amount);
  await approveTx.wait();
  console.log("Approved WFCA transfer");

  console.log("Transferring WFCA to swap contract...");
  const transferTx = await wfca.transfer(swapContract.address, amount);
  await transferTx.wait();
  console.log("Transferred WFCA to swap contract");

  // Verify the balance
  const balance = await wfca.balanceOf(swapContract.address);
  console.log(`Swap contract WFCA balance: ${hre.ethers.utils.formatEther(balance)}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
