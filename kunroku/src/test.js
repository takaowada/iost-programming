/*
ブロックチェーンデータをFIXするスクリプト
データにハッシュユーザIDを追加する
*/
"use strict";
// File I/O
import fs from "fs";
import path from "path";
import IOST from "iost";
import bs58 from "bs58";

// IOST object
const iost = new IOST.IOST({
  gasRatio: 1,
  gasLimit: 1000000,
  delay: 0,
  expiration: 90,
  defaultLimit: "unlimited",
});

const userHome =
  process.env[process.platform == "win32" ? "USERPROFILE" : "HOME"];

const ADMIN = "admin";

///////////////////////////////////////////////////////////////////////////
// ローカル
///////////////////////////////////////////////////////////////////////////
const LOCAL_IP = "127.0.0.1";
// RPC address of IOST
const LOCAL_HOST = `http://${LOCAL_IP}:30001`;
// RPC object
const LOCAL_RPC = new IOST.RPC(new IOST.HTTPProvider(LOCAL_HOST));

/**
 * アカウントをファイルから取得する。
 *
 * @param {*} accountID
 */
const _loadAccount = (accountID) => {
  const filePath = path.join(userHome, ".iwallet/" + accountID + ".json");
  console.log(`Using account=${accountID}`);
  console.log(`filePath=${filePath}`);
  try {
    const data = fs.readFileSync(filePath, "utf8");
    const keypair = JSON.parse(data);
    //logger.info(keypair)
    const account = new IOST.Account(accountID);
    const ownerKp = new IOST.KeyPair(
      bs58.decode(keypair.keypairs.owner.raw_key)
    );
    account.addKeyPair(ownerKp, "owner");
    const activeKp = new IOST.KeyPair(
      bs58.decode(keypair.keypairs.active.raw_key)
    );
    account.addKeyPair(activeKp, "active");

    return account;
  } catch (err) {
    console.log(err);
    console.log(`Error: Keypair not found: ${accountID}`);
    throw err;
  }
};

/**
 * 証明書のユーザIDを追加する。
 */
async function _update() {
  try {
    const tx = iost.callABI("token.iost", "balanceOf", ["iost", "alice"]);
    //const tx = iost.callABI("token.iost", "transfer", ["iost", "alice", "bobby", "1", "memojs"]);
    tx.addApprove("iost", 1);
    tx.setChainID(1020);
    tx.amount_limit = [{ token: "*", value: "unlimited" }];
    const account = _loadAccount("alice");
    iost.setAccount(account);
    iost.setRPC(LOCAL_RPC);
    await iost
      .signAndSend(tx)
      .on("pending", () => {
        console.log("Pending generation");
      })
      .on("success", async (response) => {
        console.log("Success... tx, receipt: " + JSON.stringify(response));
      })
      .on("failed", (err) => {
        console.log("failed: " + JSON.stringify(err));
      });
  } catch (err) {
    console.log(err);
  } finally {
    console.log("Releasing a connection to the pool...");
  }
}

(async () => {
  await _update();
})();
