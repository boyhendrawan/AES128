class CaesarChiper {
  alphabets = "abcdefghijklmnopqrstuvwxyz".toUpperCase();
  constructor(plainText = "", key = "") {
    this.plainText = plainText;
    this.key = key;
  }
  generateNewChiperText(key = 0) {
    let arr = this.alphabets.split("");
    // Cipher Get
    return arr.reduce((a, c, i) => {
      let result = [...a];
      let tIndex = (i + key) % arr.length;
      result[i] = arr[tIndex];
      return result;
    }, []);
  }
  encrypt() {
    // generate the original chiper
    const originalChiper = this.generateNewChiperText();
    const chiperWithKey = this.generateNewChiperText(this.key);
    const result = [...this.plainText].join("");
    return result
      .toUpperCase()
      .split("")
      .map(function (p, i) {
        let indexInAlphabets = originalChiper.findIndex((c) => p == c);
        return chiperWithKey[indexInAlphabets];
      })
      .join("");
  }
  description(chiper, key) {
    const originalChiper = this.generateNewChiperText();
    const chiperWithKey = this.generateNewChiperText(key);
    console.log(key);
    console.log(chiperWithKey);
    return chiper
      .toUpperCase()
      .split("")
      .map(function (p, i) {
        let indexInAlphabets = chiperWithKey.findIndex((c) => p == c);
        return originalChiper[indexInAlphabets];
      })
      .join("");
  }
}
