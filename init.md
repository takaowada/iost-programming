# iwallet テスト

0. ２回目以降、クリアするなら
`rm -rf iserver`
1. docker-compose で起動
`docker-compose up -d`
2. アカウント作成
```
docker exec -t iserver iwallet  account create bobby --account admin --chain_id 1020
docker exec -t iserver iwallet  account create alice --account admin --chain_id 1020
docker exec -t iserver iwallet transfer bobby 10000 --account admin --chain_id 1020
docker exec -t iserver iwallet transfer alice 10000 --account admin --chain_id 1020
```
3. iwallet処理
```
docker exec -t iserver iwallet sys pledge 1000 --account bobby --gas_user alice --chain_id 1020
# Error
docker exec -t iserver iwallet sys unpledge 100 --account alice --gas_user alice --chain_id 1020
docker exec -t iserver iwallet sys unpledge 100 --account bobby --gas_user alice --chain_id 1020
docker exec -t iserver iwallet sys pledge 1000 --account bobby --chain_id 1020
docker exec -t iserver iwallet sys pledge 1000 --account alice --chain_id 1020
```