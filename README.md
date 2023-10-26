# Tuitionchain
This project is using sCrypt building dapps on BSV blockchain in Exeter Hackathon.

Tuition chain is a tool for personal educational funds management which allows you to use faucet contract to customise your payments plan. see more: Google Drive link: https://drive.google.com/file/d/1hdRR3Vr0XXYqWFPxbFFQij61M50z-6yt/view?usp=sharing

In this demo we use hypothetical students in api file, you can change these manually. 

To set up your contracts, you may use sensilet wallets on https://chrome.google.com/webstore/detail/sensilet/aadkcfdlmiddiiibdnhfbpbmfcaoknkm to get testnet bsv on your address by https://scrypt.io/faucet/

1.craete scaffold

$npx create-react-app tuitionchain

$cd voting

$npx scrypt-cli init

This command will create a contract file at src\contracts\voting.ts, replace the content of the file with the contract from contracts file

2.complie and deployment

$npx scrypt-cli compile

create a .env file and save your private key in the PRIVATE_KEY environment variable.

$npm run deploy:contract

You can get the deployed contract's ID: the TXID and the output index where the contract is located.

Copy the deployment TxID then change the value of ContractId in file src/App.tsx:

3. run

$npm start
