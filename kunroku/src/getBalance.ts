/*
ブロックチェーンデータをFIXするスクリプト
データにハッシュユーザIDを追加する
*/
'use strict'
const log4js = require('log4js')
log4js.configure({
	appenders: {
		out: {
            type: 'stdout'
        }
    },
	categories: {
        default: {
            appenders: ['out'], level: 'debug'
        },
    }
})
const logger = log4js.getLogger()
const checklogger = log4js.getLogger('Atrust')
const Sequelize = require('sequelize')
const { Models } = require('../../atrust-rest-api/src/infrastructure/db')

const dotenv = require('dotenv')
dotenv.config()
logger.info(`NODE_ENV=${process.env.NODE_ENV}`)

// Date
require('date-utils')

// File I/O
const fs = require('fs')
const path = require("path")

// IOST
const IOST = require('iost')
const bs58 = require('bs58')
// IOST object
const iost = new IOST.IOST({
    gasRatio: 1,
    gasLimit: 1000000,
    delay: 0,
    expiration: 90,
    defaultLimit: 'unlimited',
})

const userHome = process.env[process.platform == "win32" ? "USERPROFILE" : "HOME"]

const ADMIN = "at_admin";

///////////////////////////////////////////////////////////////////////////
// ローカル
///////////////////////////////////////////////////////////////////////////
const LOCAL_CONTRACT = "Contract8HBMQEYnGYg3drvavSFGR73pcuh4iAAfwLDN9HjB9nk5";
const LOCAL_IP = "127.0.0.1";
// RPC address of IOST
const LOCAL_HOST = `http://${LOCAL_IP}:30001`;
// RPC object
const LOCAL_RPC = new IOST.RPC(new IOST.HTTPProvider(LOCAL_HOST));

///////////////////////////////////////////////////////////////////////////
// STG
///////////////////////////////////////////////////////////////////////////
const STG_CONTRACT="ContractHFs65266U5bRw4PWm8DUCXZ7LJFxrZcjE1J6wm87ts47";
const STG_IP = "54.236.58.28";
// RPC address of IOST
const STG_HOST = `http://${STG_IP}:30001`;
// RPC object
const STG_RPC = new IOST.RPC(new IOST.HTTPProvider(STG_HOST))

const DELAY = 5000;

// IOST chain ID
const CHAINID = 1024;

const certData = [];

const convertUndefToNull = (param) => {
    for(let i=0; i < param.length; i++){
        if(param[i] === undefined){
            param[i] = null
        }
    }
    return param
}

/**
 * アカウントをファイルから取得する。
 * 
 * @param {*} accountID 
 */
const _loadAccount = (accountID) => {
    const filePath = path.join(userHome, '.iwallet/' + accountID + '.json')
    logger.debug(`Using account=${accountID}`)
    logger.debug(`filePath=${filePath}`)
    try {
        const data = fs.readFileSync(filePath, 'utf8')
        const keypair = JSON.parse(data)
        //logger.info(keypair)
        const account = new IOST.Account(accountID)
        const ownerKp = new IOST.KeyPair(bs58.decode(keypair.keypairs.owner.raw_key))
        account.addKeyPair(ownerKp, "owner")
        const activeKp = new IOST.KeyPair(bs58.decode(keypair.keypairs.active.raw_key))
        account.addKeyPair(activeKp, "active")
    
        return account
    } catch (err) {
        logger.error(err)
        logger.error(`Error: Keypair not found: ${accountID}`)
        throw err
    }
}

/**
 * 証明書をダンプする。
 * ただし、データ１００件までなので、初期テスト以外は利用できない。
 * 
 * @param {*} index
 */
async function _dump(rpc, contract) {
    logger.info(`############## 証明書ダンプ開始`);

    // コントラクトデータを呼び出す
    const result = await rpc.blockchain.getContractStorageFields(
        contract,
        'cert',
        true
    );
    logger.info(result);

    for (let i = 0; i < result.fields.length; i++) { 
        const key = result.fields[i];   
        // コントラクトデータを呼び出す
        const result2 = await rpc.blockchain.getContractStorage(
            contract,
            'cert',
            key,
            true
        );
        if (!result2.userId) {
            logger.error(`ユーザIDなし: ${key}`)
        }
        //logger.info(result2);
        certData.push(result2.data);
    }
}

/**
 * 証明書をDBデータからダンプする。
 * 
 * @param {*} index
 */
async function _getFromDB(rpc, contract) {
    logger.info(`############## DB証明書ダンプ開始`);

    // DBを呼び出す
    const certs = await Models.Cert.findAll({ raw: true })
    //logger.info('certs');
    //logger.info(certs);

    for (let i = 0; i < certs.length; i++) { 
        if (certs[i].deleteDate) {
            // 削除データは読み飛ばす
            logger.error(`Deleted cert: ${certs[i].hashCertId}`)
            continue;
        }
        const key = certs[i].hashCertId;   
        // コントラクトデータを呼び出す
        const result2 = await rpc.blockchain.getContractStorage(
            contract,
            'cert',
            key,
            true
        );
        const json = JSON.parse(result2.data)
        if (!json) {
            logger.error(`BCデータなし: ${key}`)
            //logger.info(result2);
        } else if (!json.userId) {
            logger.info(`ユーザIDなし: ${key}`)
            if (json.ownerLog[2]) {
                logger.error(`ログ２なし`)
            } else if (json.ownerLog[1]) {
                logger.error(`ログ１なし`)
            } else if (json.ownerLog[0]) {
                //logger.error(`ログ０なし`)
            }
            certData.push(json);
        } else {
            logger.info(`ユーザIDあり: ${key}`)
            logger.info(json);
        }
    }
}

/**
 * 証明書のユーザIDを追加する。
 */
async function _update(rpc, contract) {
    logger.info(`############## 証明書登録開始`)
    iost.setRPC(rpc)

    const certData2 = []

    try {
        logger.info(`############## 証明書配列データ`)
        logger.info(certData);
        logger.info(`Loading count=${certData.length}`);
        // 証明書を登録する
        for (let i = 0; i < certData.length; i++) {
            const json = certData[i];
            //const json = JSON.parse(data)
            // logger.debug(json);
            if (json) {
                if (!json.userId) {
                    logger.error(`############## ユーザIDなし: ${json.hashCertId}`)
                    //logger.error(json.ownerLog)
                    const hashCertId = json.hashCertId
                    const filter = {
                        where: {
                            hashCertId
                        },
                        limit: 1,
                        order: [['assetSeq', 'ASC']],
                        raw: true,
                    }
                    const cert = await Models.Cert.findOne(filter)
                    if (cert && cert.users_id) {
                        const user = await Models.User.findByPk(cert.users_id)
                        logger.debug(user);
                        json.userId = user.hashUserId
                        if (json.ownerLog[2]) {
                            json.ownerLog[2].userId = user.hashUserId
                        } else if (json.ownerLog[1]) {
                            json.ownerLog[1].userId = user.hashUserId
                        } else if (json.ownerLog[0]) {
                            json.ownerLog[0].userId = user.hashUserId
                        }
                        logger.debug(json)
                    } else {
                        logger.error('DBにユーザIDなし')
                    }
                }
                certData2.push(json)
            } else {
                logger.error('データなし')
                logger.debug(json);
                continue;
            }
            // ブロックチェーンを呼び出し
            const data = JSON.stringify(json)
            logger.info(data)
            const tx = iost.callABI(contract, "fixCert", [json.hashCertId, data]);
            tx.setChainID(CHAINID);
            tx.amount_limit = [{ token: "*", value: "unlimited" }];
            const account = _loadAccount(ADMIN);
            iost.setAccount(account);
            await iost.signAndSend(tx)
                .on('pending', () => {
                    logger.debug("Pending generation");
                })
                .on('success', async (response) => {
                    logger.info("Success... tx, receipt: " + JSON.stringify(response));
                })
                .on('failed', (err) => {
                    logger.error("failed: " + JSON.stringify(err));
                });
        }
    } catch (err) {
        logger.error(err);
    } finally {
        logger.debug('Releasing a connection to the pool...');
    }

    logger.info('############## ユーザIDの追加確認')
    for (let i = 0; i < certData2.length; i++) {
        if (!certData2[i].userId) {
            logger.error(`ユーザIDなし: ${certData2[i].hashCertId}`)
            logger.error(certData2[i])
        }
        if (!certData2[i].ownerLog[0].userId) {
            logger.error(`ユーザIDなし: ${certData2[i].hashCertId}`)
            logger.error(certData2[i])
        }
    }
}

(async () => {
    await _getFromDB(LOCAL_RPC, LOCAL_CONTRACT);
    //await _getFromDB(STG_RPC, STG_CONTRACT);
    //logger.info(`############## 証明書配列データ`)
    //logger.info(certData);
    await _update(LOCAL_RPC, LOCAL_CONTRACT);
})();
