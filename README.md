# CAMEP-WFCA Swap

CAMEP（キャメップ）トークンとWFCA（ワッフカ）トークンのスワップサイト。

## 交換レート

- 1 CAMEP = 100,000 JPY相当のWFCA
- WFCAの価格は30秒ごとに自動更新

## コントラクトアドレス

- CAMEP: `0x068F6B14CcDE2459ed748616BFeD0cA51074c671`
- WFCA: `0xae4533189c7281501f04ba4b7c37e3aded402902`
- スワップコントラクト: `0xBa2e8794Ca2C7e80C4dcB29Ae07A681172e52b2B`

## 機能

- MetaMaskウォレット接続
- CAMEP/WFCA残高表示
- WFCA入金機能
- CAMEP→WFCAスワップ機能
- リアルタイム価格表示
  - WFCA価格（JPY）
  - JPYC価格（USD）

## 技術スタック

- フロントエンド: HTML/JavaScript
- Web3: web3.js
- スマートコントラクト: Solidity
- 開発環境: Hardhat
- デプロイ: Netlify

## セットアップ

1. リポジトリをクローン
```bash
git clone [repository-url]
cd camep-wfca-swap
```

2. 依存関係をインストール
```bash
npm install
```

3. 開発サーバーを起動
```bash
npx http-server
```

4. ブラウザで開く
```
http://localhost:8080
```

## 注意事項

- MetaMaskのインストールが必要です
- イーサリアムメインネットに接続してください
- スワップ実行時にはガス代が必要です
