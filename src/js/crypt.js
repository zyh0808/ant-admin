import CryptoJS from 'crypto-js'

export function SHA256 (value) {
  let sign = CryptoJS.SHA256(value).toString(CryptoJS.enc.Hex).toUpperCase();
  return sign
}