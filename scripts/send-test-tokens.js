const hre = require("hardhat");

async function main() {
  const [owner] = await hre.ethers.getSigners();
  const testUser = owner.address; // MetaMaskのアドレスに変更可能

  // Get the mock CAMEP contract
  const MockCAMEP = await hre.ethers.getContractFactory("MockCAMEP");
  const mockCamep = await MockCAMEP.attach('0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512');

  // Send 1000 CAMEP to test user
  const amount = hre.ethers.utils.parseEther("1000");
  console.log(`Sending ${hre.ethers.utils.formatEther(amount)} CAMEP to ${testUser}...`);

  const tx = await mockCamep.transfer(testUser, amount);
  await tx.wait();

  // Check the new balance
  const balance = await mockCamep.balanceOf(testUser);
  console.log(`Test user CAMEP balance: ${hre.ethers.utils.formatEther(balance)}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
