const CAMEP_ADDRESS = '0x068F6B14CcDE2459ed748616BFeD0cA51074c671';
const WFCA_ADDRESS = '0xae4533189c7281501f04ba4b7c37e3aded402902';
const SWAP_WALLET_ADDRESS = '0xc30d3f4661ee7A1db663D61A2C9f98AbB4Db77fc';

const CAMEP_ABI = [
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function decimals() view returns (uint8)",
    "function totalSupply() view returns (uint256)",
    "function balanceOf(address) view returns (uint256)",
    "function transfer(address to, uint256 amount) returns (bool)",
    "function allowance(address owner, address spender) view returns (uint256)",
    "function approve(address spender, uint256 amount) returns (bool)",
    "function transferFrom(address from, address to, uint256 amount) returns (bool)",
    "event Transfer(address indexed from, address indexed to, uint256 value)",
    "event Approval(address indexed owner, address indexed spender, uint256 value)"
];

const WFCA_ABI = [
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function decimals() view returns (uint8)",
    "function totalSupply() view returns (uint256)",
    "function balanceOf(address) view returns (uint256)",
    "function transfer(address to, uint256 amount) returns (bool)",
    "function allowance(address owner, address spender) view returns (uint256)",
    "function approve(address spender, uint256 amount) returns (bool)",
    "function transferFrom(address from, address to, uint256 amount) returns (bool)",
    "event Transfer(address indexed from, address indexed to, uint256 value)",
    "event Approval(address indexed owner, address indexed spender, uint256 value)"
];

let web3;
let userAccount;
let camepContract;
let wfcaContract;

// Price variables
let currentWfcaPrice = 0;
let currentJpycPrice = 0;

// UI Elements
const loadingSpinner = document.getElementById('loadingSpinner');
const statusMessage = document.getElementById('statusMessage');
const balanceInfo = document.getElementById('balanceInfo');

function showLoading() {
    loadingSpinner.style.display = 'block';
    document.querySelector('.swap-box').classList.add('loading');
}

function hideLoading() {
    loadingSpinner.style.display = 'none';
    document.querySelector('.swap-box').classList.remove('loading');
}

function showStatus(message, isError = false) {
    statusMessage.textContent = message;
    statusMessage.className = 'status ' + (isError ? 'error' : 'success');
}

async function updatePrices() {
    try {
        showLoading();
        // Get WFCA price
        const wfcaResponse = await axios.get('https://corsproxy.io/?https://api.coingecko.com/api/v3/simple/price?ids=wfca&vs_currencies=jpy');
        currentWfcaPrice = wfcaResponse.data.wfca.jpy;

        // Get JPYC price
        const jpycResponse = await axios.get('https://corsproxy.io/?https://api.coingecko.com/api/v3/simple/price?ids=jpy-coin&vs_currencies=usd');
        currentJpycPrice = jpycResponse.data['jpy-coin'].usd;

        // Update UI
        document.getElementById('wfcaPrice').textContent = currentWfcaPrice.toFixed(2);
        document.getElementById('jpycPrice').textContent = currentJpycPrice.toFixed(4);

        // Update WFCA amount if CAMEP amount is entered
        updateWfcaAmount();
        hideLoading();
    } catch (error) {
        console.error('価格取得エラー:', error);
        showStatus('価格の取得に失敗しました。しばらく待ってから再試行してください。', true);
        hideLoading();
    }
}

function updateWfcaAmount() {
    const camepAmount = document.getElementById('camepAmount').value;
    const swapButton = document.getElementById('swapButton');
    
    if (camepAmount && currentWfcaPrice > 0) {
        // 1 CAMEP = 1 JPY worth of WFCA
        const jpyValue = camepAmount * 1;
        const wfcaAmount = jpyValue / currentWfcaPrice;
        document.getElementById('wfcaAmount').value = wfcaAmount.toFixed(8);
        swapButton.disabled = false;
    } else {
        document.getElementById('wfcaAmount').value = '';
        swapButton.disabled = true;
    }
}

async function updateBalances() {
    if (!userAccount || !camepContract || !wfcaContract) return;

    try {
        const camepBalance = await camepContract.methods.balanceOf(userAccount).call();
        const wfcaBalance = await wfcaContract.methods.balanceOf(userAccount).call();

        document.getElementById('camepBalance').textContent = web3.utils.fromWei(camepBalance);
        document.getElementById('wfcaBalance').textContent = web3.utils.fromWei(wfcaBalance);
        balanceInfo.style.display = 'block';
    } catch (error) {
        console.error('Error updating balances:', error);
        showStatus('Error fetching balances', true);
    }
}

async function connectWallet() {
    if (typeof window.ethereum !== 'undefined') {
        try {
            showLoading();
            showStatus('MetaMaskに接続中...');

            // Check if already connected
            let accounts = await window.ethereum.request({ method: 'eth_accounts' });
            
            // If not connected, request connection
            if (!accounts.length) {
                accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            }

            userAccount = accounts[0];
            
            // Check network
            const chainId = await window.ethereum.request({ method: 'eth_chainId' });
            if (chainId !== '0x1') { // Ethereum Mainnet
                showStatus('イーサリアムメインネットに切り替えてください', true);
                hideLoading();
                return;
            }

            web3 = new Web3(window.ethereum);
            
            try {
                camepContract = new web3.eth.Contract(CAMEP_ABI, CAMEP_ADDRESS);
                wfcaContract = new web3.eth.Contract(WFCA_ABI, WFCA_ADDRESS);
            } catch (contractError) {
                console.error('Contract initialization error:', contractError);
                showStatus('トークンコントラクトの初期化に失敗しました', true);
                hideLoading();
                return;
            }

            document.getElementById('connectWallet').textContent = 'ウォレット接続済み';
            updateWfcaAmount(); // This will handle the swap button state

            await updateBalances();
            showStatus('MetaMaskの接続に成功しました！');
            hideLoading();

        } catch (error) {
            console.error('Wallet connection error:', error);
            if (error.code === 4001) {
                showStatus('ウォレット接続が拒否されました', true);
            } else {
                showStatus('ウォレット接続エラー: ' + error.message, true);
            }
            hideLoading();
        }
    } else {
        showStatus('MetaMaskをインストールしてください！', true);
        window.open('https://metamask.io/download.html', '_blank');
    }
}

async function performSwap() {
    try {
        showLoading();
        const camepAmount = document.getElementById('camepAmount').value;
        const wfcaAmount = document.getElementById('wfcaAmount').value;

        if (!camepAmount || !wfcaAmount) {
            showStatus('有効な金額を入力してください', true);
            hideLoading();
            return;
        }

        // Convert amounts to wei
        const camepWei = web3.utils.toWei(camepAmount.toString());
        const wfcaWei = web3.utils.toWei(wfcaAmount.toString());

        // First approve the contract to spend CAMEP
        showStatus('CAMEPトークンの承認中...');
        await camepContract.methods.approve(SWAP_WALLET_ADDRESS, camepWei).send({
            from: userAccount
        });

        // Then perform the swap
        showStatus('スワップを実行中...');
        await camepContract.methods.transfer(SWAP_WALLET_ADDRESS, camepWei).send({
            from: userAccount
        });

        showStatus('スワップが完了しました！');
        await updateBalances();
        hideLoading();
    } catch (error) {
        console.error('スワップエラー:', error);
        if (error.code === 4001) {
            showStatus('トランザクションが拒否されました', true);
        } else {
            showStatus('スワップエラー: ' + error.message, true);
        }
        hideLoading();
    }
}

// Event Listeners
document.getElementById('connectWallet').addEventListener('click', connectWallet);
document.getElementById('swapButton').addEventListener('click', performSwap);
document.getElementById('camepAmount').addEventListener('input', updateWfcaAmount);

// Update prices every 30 seconds
updatePrices();
setInterval(updatePrices, 30000);

// Listen for account changes
if (window.ethereum) {
    window.ethereum.on('accountsChanged', function (accounts) {
        userAccount = accounts[0];
        connectWallet();
    });
}
