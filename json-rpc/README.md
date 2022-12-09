# JSON-RPC API

## ストレージ情報の取得

### 2.1 キーに対応するフィールド一覧の取得

$ curl -X POST http://127.0.0.1:30001/getContractStorageFields -d '{"id":"auth.iost","key":"auth","by_longest_chain":true}' | jq .

### 2.2 フィールドデータの取得

$ curl -X POST http://127.0.0.1:30001/getContractStorage -d '{"id":"ContractDvbrQ2dmQCRE6q1CwQKkqtmDMmS2s9BZYnnwFvL5sEpc","key":"number1","by_longest_chain":true}' | jq .

## チェーンとノード情報の取得

### 3.1 チェーン情報の取得

$ curl http://api.iost.io/getChainInfo | jq .
$ curl http://127.0.0.1:30001/getChainInfo | jq .

### 3.2 ノード情報の取得

$ curl http://127.0.0.1:30001/getNodeInfo | jq .

## GASとRAM情報の取得

### 4.1 GASレートの取得

$ curl http://api.iost.io/getGasRatio | jq .

### 4.2 RAM情報の取得

$ curl http://api.iost.io/getRAMInfo | jq .
