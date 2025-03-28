# CAMEP-WFCA Swap

CAMEPトークンとWFCAトークンの交換サイト

## 機能

- CAMEP/WFCA交換レート：1 CAMEP = 1円分のWFCA
- CoinGeckoからのリアルタイム価格取得
- MetaMaskウォレット連携
- トークン残高表示
- 自動レート計算

## トークン情報

### CAMEP Token
- アドレス: 0x068F6B14CcDE2459ed748616BFeD0cA51074c671

### WFCA Token
- アドレス: 0xae4533189c7281501f04ba4b7c37e3aded402902

## セットアップ

1. リポジトリをクローン:
```bash
git clone https://github.com/[username]/camep-wfca-swap.git
cd camep-wfca-swap
```

2. 依存関係のインストール:
```bash
npm install
```

3. 開発サーバーの起動:
```bash
npm start
```

## デプロイ

1. Netlifyにデプロイする場合:
- GitHubリポジトリと連携
- ビルド設定:
  - Build command: 不要
  - Publish directory: ./

## 使い方

1. MetaMaskをインストール
2. ウォレットを接続
3. 交換したいCAMEP量を入力
4. 「Swap」ボタンをクリックして交換を実行

## 注意事項

- 必ずMetaMaskをインストールしてください
- 十分なCAMEPトークン残高があることを確認してください
- ガス代用のETHが必要です
