import CryptoJS from 'react-native-crypto-js';

export class AES {
  public encryptWithRandomKey = (data: string) => {
    const encryptionKey = this.generateKey(256);
    const encryptedData = CryptoJS.AES.encrypt(data, encryptionKey).toString();
    return { encryptionKey, encryptedData };
  };

  public decrypt = (data: string, key: string) => {
    const decryptedBytes = CryptoJS.AES.decrypt(data, key);
    const decryptedValue = decryptedBytes.toString(CryptoJS.enc.Utf8);
    return decryptedValue;
  };
  private generateKey = (length: number) => {
    let key = '';
    const hex = '0123456789abcdef';
    let i: number;
    for (i = 0; i < length; i++) {
      key += hex.charAt(Math.floor(Math.random() * 16));
    }
    return key;
  };

  public encryptDataWithKey = (key: string, data: string): string => {
    const iv = CryptoJS.lib.WordArray.random(16).toString(CryptoJS.enc.Hex);
    const encrypted = CryptoJS.AES.encrypt(data, key, {
      iv: CryptoJS.enc.Hex.parse(iv),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
      format: CryptoJS.format.Hex,
      algorithm: 'AES-256-CBC',
    });
    return encrypted.toString();
  };
}
