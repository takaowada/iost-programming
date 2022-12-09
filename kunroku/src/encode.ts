//import { box, randomBytes } from 'tweetnacl';
import tweetnacl from 'tweetnacl';
//const { box, randomBytes } = tweetnacl;
import tweetnaclUtil from 'tweetnacl-util';
import bs58 from 'bs58';

//const newNonce = () => tweetnacl.randomBytes(tweetnacl.box.nonceLength);
//export const generateKeyPair = () => tweetnacl.box.keyPair();

const newNonce = () => tweetnacl.randomBytes(tweetnacl.secretbox.nonceLength);

export const generateKey = () => tweetnaclUtil.encodeBase64(tweetnacl.randomBytes(tweetnacl.secretbox.keyLength));


export const encrypt2 = (
  secretOrSharedKey: Uint8Array,
  messageUint8: Uint8Array,
  key?: Uint8Array
) => {
  const nonce = newNonce();
  const encrypted = key
    ? tweetnacl.box(messageUint8, nonce, key, secretOrSharedKey)
    : tweetnacl.box.after(messageUint8, nonce, secretOrSharedKey);
  const fullMessage = new Uint8Array(nonce.length + encrypted.length);
  fullMessage.set(nonce);
  fullMessage.set(encrypted, nonce.length);

  const base64FullMessage = tweetnaclUtil.encodeBase64(fullMessage);
  return base64FullMessage;
};

export const decrypt2 = (
  secretOrSharedKey: Uint8Array,
  messageWithNonce: string,
  key?: Uint8Array
) => {
  const messageWithNonceAsUint8Array = tweetnaclUtil.decodeBase64(messageWithNonce);
  const nonce = messageWithNonceAsUint8Array.slice(0, tweetnacl.box.nonceLength);
  const message = messageWithNonceAsUint8Array.slice(
    tweetnacl.box.nonceLength,
    messageWithNonce.length
  );

  const decrypted = key
    ? tweetnacl.box.open(message, nonce, key, secretOrSharedKey)
    : tweetnacl.box.open.after(message, nonce, secretOrSharedKey);

  if (!decrypted) {
    throw new Error('Could not decrypt message');
  }

  const base64DecryptedMessage = tweetnaclUtil.encodeUTF8(decrypted);
  return base64DecryptedMessage;
};

export const encrypt = (originalText: string, key: string) => {
  const keyUint8Array = tweetnaclUtil.decodeBase64(key);

  const nonce = newNonce();
  const messageUint8 = tweetnaclUtil.decodeUTF8(originalText);
  const box = tweetnacl.secretbox(messageUint8, nonce, keyUint8Array);

  const fullMessage = new Uint8Array(nonce.length + box.length);
  fullMessage.set(nonce);
  fullMessage.set(box, nonce.length);

  const base64FullMessage = tweetnaclUtil.encodeBase64(fullMessage);
  return base64FullMessage;
};

export const decrypt = (messageWithNonce: string, key: string) => {
  const keyUint8Array = tweetnaclUtil.decodeBase64(key);
  const messageWithNonceAsUint8Array = tweetnaclUtil.decodeBase64(messageWithNonce);
  const nonce = messageWithNonceAsUint8Array.slice(0, tweetnacl.secretbox.nonceLength);
  const message = messageWithNonceAsUint8Array.slice(
    tweetnacl.secretbox.nonceLength,
    messageWithNonce.length
  );

  const decrypted = tweetnacl.secretbox.open(message, nonce, keyUint8Array);

  if (!decrypted) {
    throw new Error("Could not decrypt message");
  }

  const base64DecryptedMessage = tweetnaclUtil.encodeUTF8(decrypted);
  return base64DecryptedMessage;
};

/**
 * Get encoded password key.
 * @param passwd 
 * @returns encoded password
 */
 export const getPasswordKey = (passwd: string): string  => {
  const padPasswd = ( "                                " + passwd ).slice( -32 );
  const passwdUint8 = tweetnaclUtil.decodeUTF8(padPasswd);
  const encodedKey = tweetnaclUtil.encodeBase64(passwdUint8);
  return encodedKey;
}

const key = generateKey();
console.log('key:', key); 
const obj = "hello world";
const encrypted = encrypt(obj, key);
console.log('encrypted:', encrypted, obj); 
const decrypted = decrypt(encrypted, key);
console.log('decrypted:', decrypted); 

// パスワード
const passwd = 'pass';
console.log('passwd:', passwd);
const padPasswd = ( '                                ' + passwd ).slice( -32 );
const passwdUint8 = tweetnaclUtil.decodeUTF8(padPasswd);
const encodedKey = tweetnaclUtil.encodeBase64(passwdUint8);
console.log('encodedKey:', encodedKey);

// 保存する秘密鍵
const lockKey = generateKey();
console.log('lockKey:', lockKey);
const savedKey = encrypt(lockKey, encodedKey);
console.log('savedKey:', savedKey);

// アカウント秘密鍵
const accountKey = generateKey();
console.log('accountKey:', accountKey);

// 保存された秘密鍵の復元
const decryptedLockKey = decrypt(savedKey, encodedKey);
console.log('decryptedLockKey:', decryptedLockKey);

// アカウント秘密鍵の保存
const savedAccountKey = encrypt(accountKey, decryptedLockKey);
console.log('savedAccountKey:', savedAccountKey);

// 保存されたアカウント秘密鍵の復元
const decryptedAccountSecKey = decrypt(savedAccountKey, decryptedLockKey);
console.log('decryptedAccountSecKey:', decryptedAccountSecKey);


const testKey = 'FTUxO/0BBM1aaFHbBq/l1DdfBmVIHUDYVCji8xHlLVENLq+f8IpUkEfVk8I+3hK5AYiOrnk1R/CpsNUA0PuCvKXOyPnmBEoIIAuHZFlByHXM8qTA';
const passKey = getPasswordKey('pass1234');

const decryptedKey = decrypt(testKey, passKey);
console.log('decryptedKey:', decryptedKey);
