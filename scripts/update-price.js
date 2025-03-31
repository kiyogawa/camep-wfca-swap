const hre = require("hardhat");
const axios = require("axios");

async function main() {
  // Get the deployed contract
  const swapContract = await hre.ethers.getContractAt(
    "SwapContract",
    "0x05990D236C42D35F121F13C87b0C40293b9838FE"
  );

  try {
    // Get WFCA price from CoinGecko
    const response = await axios.get(
      'https://api.coingecko.com/api/v3/simple/price?ids=wfca&vs_currencies=jpy'
    );
    
    const wfcaPriceInJpy = Math.round(response.data.wfca.jpy * 1000000); // Convert to contract format (6 decimals)
    console.log(`New WFCA price: ${wfcaPriceInJpy} (${response.data.wfca.jpy} JPY)`);

    // Update price in contract
    const tx = await swapContract.setWfcaPrice(wfcaPriceInJpy);
    await tx.wait();

    console.log("Price updated successfully");
  } catch (error) {
    console.error("Error updating price:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
