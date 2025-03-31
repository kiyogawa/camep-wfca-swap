const { exec } = require('child_process');
const path = require('path');

// 5分ごとに価格を更新
const UPDATE_INTERVAL = 5 * 60 * 1000; // 5 minutes in milliseconds

function updatePrice() {
  const scriptPath = path.join(__dirname, 'update-price.js');
  const command = `npx hardhat run ${scriptPath} --network mainnet`;

  exec(command, { cwd: path.join(__dirname, '..') }, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing script: ${error}`);
      return;
    }
    if (stderr) {
      console.error(`Script stderr: ${stderr}`);
    }
    console.log(`Script output: ${stdout}`);
  });
}

// 初回実行
updatePrice();

// 定期実行を設定
setInterval(updatePrice, UPDATE_INTERVAL);

console.log('Price updater started. Press Ctrl+C to stop.');
