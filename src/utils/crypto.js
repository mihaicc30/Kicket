import CryptoJS from "crypto-js";

// Function to encrypt data
export function encryptData(data, key) {
  const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), key).toString();
  return encrypted;
}

// Function to decrypt data
export function decryptData(encryptedData, key) {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, key);
    const decrypted = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    return decrypted;
  } catch (error) {
    return false;
  }
}
