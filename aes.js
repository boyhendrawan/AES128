// for convinient i can't do it with modular
class AES {
  defaultTable = [
    ["02", "03", "01", "01"],
    ["01", "02", "03", "01"],
    ["01", "01", "02", "03"],
    ["03", "01", "01", "02"],
  ];
  s_box = [
    ["63", "7c", "77", "7b", "f2", "6b", "6f", "c5", "30", "01", "67", "2b", "fe", "d7", "ab", "76"],
    ["ca", "82", "c9", "7d", "fa", "59", "47", "f0", "ad", "d4", "a2", "af", "9c", "a4", "72", "c0"],
    ["b7", "fd", "93", "26", "36", "3f", "f7", "cc", "34", "a5", "e5", "f1", "71", "d8", "31", "15"],
    ["04", "c7", "23", "c3", "18", "96", "05", "9a", "07", "12", "80", "e2", "eb", "27", "b2", "75"],
    ["09", "83", "2c", "1a", "1b", "6e", "5a", "a0", "52", "3b", "d6", "b3", "29", "e3", "2f", "84"],
    ["53", "d1", "00", "ed", "20", "fc", "b1", "5b", "6a", "cb", "be", "39", "4a", "4c", "58", "cf"],
    ["d0", "ef", "aa", "fb", "43", "4d", "33", "85", "45", "f9", "02", "7f", "50", "3c", "9f", "a8"],
    ["51", "a3", "40", "8f", "92", "9d", "38", "f5", "bc", "b6", "da", "21", "10", "ff", "f3", "d2"],
    ["cd", "0c", "13", "ec", "5f", "97", "44", "17", "c4", "a7", "7e", "3d", "64", "5d", "19", "73"],
    ["60", "81", "4f", "dc", "22", "2a", "90", "88", "46", "ee", "b8", "14", "de", "5e", "0b", "db"],
    ["e0", "32", "3a", "0a", "49", "06", "24", "5c", "c2", "d3", "ac", "62", "91", "95", "e4", "79"],
    ["e7", "c8", "37", "6d", "8d", "d5", "4e", "a9", "6c", "56", "f4", "ea", "65", "7a", "ae", "08"],
    ["ba", "78", "25", "2e", "1c", "a6", "b4", "c6", "e8", "dd", "74", "1f", "4b", "bd", "8b", "8a"],
    ["70", "3e", "b5", "66", "48", "03", "f6", "0e", "61", "35", "57", "b9", "86", "c1", "1d", "9e"],
    ["e1", "f8", "98", "11", "69", "d9", "8e", "94", "9b", "1e", "87", "e9", "ce", "55", "28", "df"],
    ["8c", "a1", "89", "0d", "bf", "e6", "42", "68", "41", "99", "2d", "0f", "b0", "54", "bb", "16"],
  ];
  constructor(plainText, key) {
    this.plainText = plainText;
    this.key = key;
  }
  // this only can use for two dimensionals arrays
  // this code from Fawad Ghafoor
  #transpose(array) {
    return array[0].map((col, i) => array.map((row) => row[i]));
  }
  #dataToArray(data) {
    const result = [];
    const dataArray = data.split("");
    let helperI = 0;
    // to generate array 4x4 with two dimensonal array
    for (let i = 0; i < 4; i++) {
      const tmp = [];
      for (let j = 0; j < 4; j++) {
        let hexaNumber = dataArray[helperI].charCodeAt(0).toString(16).toUpperCase();
        if (hexaNumber.length == 1) hexaNumber = "0" + hexaNumber;
        tmp.push(hexaNumber);
        helperI++;
      }
      result.push(tmp);
    }
    return this.#transpose(result);
  }
  #shiftRows(data, shift) {
    let result = [...data];
    for (let i = 0; i < shift; i++) {
      // get fristData
      let first = result[0];
      result.splice(0, 1);
      result.push(first);
    }
    return result;
  }
  #intialData(data, table) {
    // assumsition var data should send just number of hexa not array
    const [first, last] = data.split("");
    return table[Number.parseInt(first, 16)][Number.parseInt(last, 16)];
  }
  #fixedLengthBinner(string1, length, char) {
    return string1.length == length ? string1 : this.#fixedLengthBinner(char + string1, length, char);
  }
  #xor(fristBinner, secondBinner) {
    const result = [];
    for (let i = 0; i < fristBinner.length; i++) {
      fristBinner[i] == secondBinner[i] ? result.push("0") : result.push("1");
    }
    return result.join("");
  }
  #hexa2binner(data) {
    const [frist, second] = data.split("");
    const fristBinner = Number.parseInt(frist, 16).toString(2);
    const secondBinner = Number.parseInt(second, 16).toString(2);
    return this.#fixedLengthBinner(fristBinner, 4, "0") + this.#fixedLengthBinner(secondBinner, 4, "0");
  }
  #binner2Hexa(data) {
    let result = Number.parseInt(data, 2).toString(16);
    if (result.length == 1) result = "0" + result;
    return result.toUpperCase();
  }
  #generateKey(key) {
    const resultKey = [];
    resultKey.push(key);
    let k = 1;
    while (k <= 10) {
      // rotate the key to get ROTWORD(ShiftRows)
      const keyTranspose = this.#transpose(resultKey[k - 1]);
      const getLastKeyT = [...keyTranspose];
      const getFristKeyT = keyTranspose[0];
      // shift theKey
      const shiftKey = this.#shiftRows(getLastKeyT[getLastKeyT.length - 1], 1);
      // sub the key
      const subBytesK = [];
      for (let i = 0; i < shiftKey.length; i++) {
        subBytesK.push(this.#intialData(shiftKey[i], this.s_box));
      }
      const nextArray = [];

      const defaultRound = ["01", "02", "04", "08", "10", "20", "40", "80", "1B", "36"];
      for (let i = 0; i < getFristKeyT.length; i++) {
        const dataShiftK = subBytesK[i];
        const dataGetLKY = getFristKeyT[i];

        // change hexa into binner
        const binnerDataSK = this.#hexa2binner(dataShiftK);
        const binnerDataGL = this.#hexa2binner(dataGetLKY);

        const resultXor1 = this.#xor(this.#fixedLengthBinner(binnerDataSK, 8, "0"), this.#fixedLengthBinner(binnerDataGL, 8, "0"));
        // save for all xor from index
        let tmpArray = [];
        let resultFristA;
        // to Xor table Rcoun
        if (i == 0) {
          let binnerDefaultR = this.#hexa2binner(defaultRound[k - 1]);
          resultFristA = this.#xor(this.#fixedLengthBinner(binnerDefaultR, 8, "0"), resultXor1);
          tmpArray.push(resultFristA);
        } else {
          resultFristA = this.#xor("00000000", resultXor1);
          tmpArray.push(resultFristA);
        }
        // doing xor for remaind all of array
        for (let j = 1; j <= 3; j++) {
          const tmpBinner = Number.parseInt(keyTranspose[j][i], 16).toString(2);
          tmpArray.push(this.#xor(this.#fixedLengthBinner(tmpBinner, 8, "0"), tmpArray[j - 1]));
        }

        tmpArray = tmpArray.map((e) => {
          let result = Number.parseInt(e, 2).toString(16).toUpperCase();
          // to privent data of hexa just contain single val
          // cause S Box need 2 argument
          if (result.length === 1) {
            result = "0" + result;
          }
          return result;
        });
        nextArray.push(tmpArray);
      }
      resultKey.push(nextArray);
      k++;
    }
    return resultKey;
  }
  // jsut get all of the arrays
  #xorArray(fristVal, secondVal) {
    const lengthData = fristVal.length;
    const myResult = [];
    for (let i = 0; i < lengthData; i++) {
      const tmpRes = [];
      for (let j = 0; j < fristVal[i].length; j++) {
        const tmpXor = this.#xor(this.#hexa2binner(fristVal[i][j]), this.#hexa2binner(secondVal[i][j]));
        tmpRes.push(this.#binner2Hexa(tmpXor));
      }
      myResult.push(tmpRes);
    }
    return myResult;
  }
  #intialArray(datas, table) {
    const result = [];
    for (let i = 0; i < datas.length; i++) {
      // here just get whole of array and reuse function of sbox
      const tmpArray = [];
      for (const data of datas[i]) {
        tmpArray.push(this.#intialData(data, table).toUpperCase());
      }
      result.push(tmpArray);
    }
    return result;
  }
  #swiftArray(datas, inverse = false) {
    let helperSwift = 0;
    if (inverse) helperSwift = 3;
    else helperSwift = 1;

    for (let i = 1; i < datas.length; i++) {
      datas[i] = this.#shiftRows(datas[i], helperSwift);

      if (inverse) helperSwift--;
      else helperSwift++;
    }

    return datas;
  }
  #addRoundKey(firstDatas, secondDatas) {
    const result = [];
    for (let i = 0; i < firstDatas.length; i++) {
      const tmpResult = [];
      for (let j = 0; j < firstDatas[i].length; j++) {
        const tmpXor = this.#xor(this.#fixedLengthBinner(this.#hexa2binner(firstDatas[i][j]), 8, "0"), this.#fixedLengthBinner(this.#hexa2binner(secondDatas[i][j]), 8, "0"));
        tmpResult.push(this.#binner2Hexa(tmpXor));
      }
      result.push(tmpResult);
    }
    return result;
  }
  #inverseMultipleHexa(fristArray, secondArray) {
    const result = fristArray
      .map((e, i) => {
        let tmpVal = [];
        let first = this.#fixedLengthBinner(Number.parseInt(this.#hexa2binner(e), 2).toString(2), 8, "0");
        let helperI = 0;
        // change fristArry to id array
        for (let i = first.length - 1; i >= 0; i--) {
          if (first[helperI] == "1") {
            tmpVal.push(i);
          }
          helperI++;
        }
        // change secondArray(defaultT) to array with valindex
        let tmpDefault = [];
        let second = this.#fixedLengthBinner(Number.parseInt(this.#hexa2binner(secondArray[i]), 2).toString(2), 8, "0");
        helperI = 0;
        // change secondArray to id array
        for (let i = second.length - 1; i >= 0; i--) {
          if (second[helperI] == "1") {
            tmpDefault.push(i);
          }
          helperI++;
        }

        // addtional val frist array with second
        let resultAdd = [];
        for (let i = 0; i < tmpVal.length; i++) {
          for (let j = 0; j < tmpDefault.length; j++) {
            resultAdd.push(tmpDefault[j] + tmpVal[i]);
          }
        }
        // generate val is more than 7

        resultAdd = resultAdd
          .map((e) => {
            if (e > 7) {
              return this.#generateValMultiple(e);
            }
            return e;
          })
          .flatMap((e) => e);
        for (let i = 0; i < resultAdd.length; i++) {
          for (let j = i + 1; j < resultAdd.length; j++) {
            if (resultAdd[i] == resultAdd[j]) {
              resultAdd.splice(i, 1);
              resultAdd.splice(j - 1, 1);
              i = -1;
              break;
            }
          }
        }
        // make the result
        let result = ["0", "0", "0", "0", "0", "0", "0", "0"];

        for (const val of resultAdd) {
          result[val] = "1";
        }
        return result.reverse().join("");
      })
      .reduce((current, index, currentIndex = 1) => {
        return this.#xor(current, index);
      });
    return this.#binner2Hexa(result);
  }
  #generateValMultiple(data) {
    // this function has function to generate data in multiple hexa which val is more than 8
    const defaultVal = [4, 3, 1, 0];
    const remainLengthD = data - 8;
    // for( l)
    return defaultVal.map((e) => e + remainLengthD);
  }
  #InverseMultiple(data, defaultTable) {
    let dataT = [...data];
    const result = [];
    dataT = this.#transpose(dataT);
    for (let i = 0; i < dataT.length; i++) {
      const tmpResult = [];
      for (let j = 0; j < dataT[i].length; j++) {
        tmpResult.push(this.#inverseMultipleHexa(dataT[i], defaultTable[j]));
      }
      result.push(tmpResult);
    }
    return this.#transpose(result);
  }
  encription() {
    const arrayPlainText = this.#dataToArray(this.plainText);
    const arrayKey = this.#dataToArray(this.key);
    const generateKey = this.#generateKey(arrayKey);
    // console.log(
    //   this.#transpose(arrayPlainText)
    //     .flatMap((e) => e)
    //     .join("")
    // );
    // below this section the method  always loop for nine times
    let xorPK = 0;
    let i = 0;
    while (i <= 9) {
      let subByteses, swiftRows, mixColumn, addRoundK;
      if (i == 0) xorPK = this.#xorArray(arrayPlainText, generateKey[i]);
      if (i != 9) {
        subByteses = this.#intialArray(xorPK, this.s_box);
        swiftRows = this.#swiftArray(subByteses);
        mixColumn = this.#InverseMultiple(swiftRows, this.defaultTable);
        addRoundK = this.#addRoundKey(mixColumn, generateKey[i + 1]);
      }
      // lastStep Of algortim AES128 just hava 3 methodes
      else {
        subByteses = this.#intialArray(xorPK, this.s_box);
        swiftRows = this.#swiftArray(subByteses);
        addRoundK = this.#addRoundKey(swiftRows, generateKey[i + 1]);
      }

      xorPK = addRoundK;
      i++;
    }
    // to transpose and made to be a dimension
    // console.log(xorPK);
    xorPK = this.#transpose(xorPK).flatMap((e) => e);
    xorPK = xorPK.map((e) => {
      return String.fromCharCode(Number.parseInt(e, 16));
    });
    return xorPK.join("");
  }
  desc(CiperText, key) {
    const inverseSBox = [
      ["52", "09", "6a", "d5", "30", "36", "a5", "38", "bf", "40", "a3", "9e", "81", "f3", "d7", "fb"],
      ["7c", "e3", "39", "82", "9b", "2f", "ff", "87", "34", "8e", "43", "44", "c4", "de", "e9", "cb"],
      ["54", "7b", "94", "32", "a6", "c2", "23", "3d", "ee", "4c", "95", "0b", "42", "fa", "c3", "4e"],
      ["08", "2e", "a1", "66", "28", "d9", "24", "b2", "76", "5b", "a2", "49", "6d", "8b", "d1", "25"],
      ["72", "f8", "f6", "64", "86", "68", "98", "16", "d4", "a4", "5c", "cc", "5d", "65", "b6", "92"],
      ["6c", "70", "48", "50", "fd", "ed", "b9", "da", "5e", "15", "46", "57", "a7", "8d", "9d", "84"],
      ["90", "d8", "ab", "00", "8c", "bc", "d3", "0a", "f7", "e4", "58", "05", "b8", "b3", "45", "06"],
      ["d0", "2c", "1e", "8f", "ca", "3f", "0f", "02", "c1", "af", "bd", "03", "01", "13", "8a", "6b"],
      ["3a", "91", "11", "41", "4f", "67", "dc", "ea", "97", "f2", "cf", "ce", "f0", "b4", "e6", "73"],
      ["96", "ac", "74", "22", "e7", "ad", "35", "85", "e2", "f9", "37", "e8", "1c", "75", "df", "6e"],
      ["47", "f1", "1a", "71", "1d", "29", "c5", "89", "6f", "b7", "62", "0e", "aa", "18", "be", "1b"],
      ["fc", "56", "3e", "4b", "c6", "d2", "79", "20", "9a", "db", "c0", "fe", "78", "cd", "5a", "f4"],
      ["1f", "dd", "a8", "33", "88", "07", "c7", "31", "b1", "12", "10", "59", "27", "80", "ec", "5f"],
      ["60", "51", "7f", "a9", "19", "b5", "4a", "0d", "2d", "e5", "7a", "9f", "93", "c9", "9c", "ef"],
      ["a0", "e0", "3b", "4d", "ae", "2a", "f5", "b0", "c8", "eb", "bb", "3c", "83", "53", "99", "61"],
      ["17", "2b", "04", "7e", "ba", "77", "d6", "26", "e1", "69", "14", "63", "55", "21", "0c", "7d"],
    ];
    const defaultTable = [
      ["0E", "0B", "0D", "09"],
      ["09", "0E", "0B", "0D"],
      ["0D", "09", "0E", "0B"],
      ["0B", "0D", "09", "0E"],
    ];
    const ciperToArray = this.#dataToArray(CiperText);

    const arrayKey = this.#dataToArray(key);
    console.log(arrayKey);
    const generateKey = this.#generateKey(arrayKey);
    let i = 10;
    let xorPK = 0;
    while (i > 0) {
      let swiftArray, subByteses, inverseAddRK, inverseMixCol;
      if (i == 10) {
        xorPK = this.#xorArray(ciperToArray, generateKey[i]);
      }
      if (i != 1) {
        swiftArray = this.#swiftArray(xorPK, true);
        subByteses = this.#intialArray(swiftArray, inverseSBox);
        inverseAddRK = this.#addRoundKey(subByteses, generateKey[i - 1]);
        inverseMixCol = this.#InverseMultiple(inverseAddRK, defaultTable);
        xorPK = inverseMixCol;
      } else {
        swiftArray = this.#swiftArray(xorPK, true);
        subByteses = this.#intialArray(swiftArray, inverseSBox);
        inverseAddRK = this.#addRoundKey(subByteses, generateKey[i - 1]);
        xorPK = inverseAddRK;
      }

      i--;
    }
    // to transpose and made to be a dimension
    xorPK = this.#transpose(xorPK).flatMap((e) => e);
    xorPK = xorPK.map((e) => {
      return String.fromCharCode(Number.parseInt(e, 16));
    });
    // console.log(xorPK.join(""));
    return xorPK.join("");
  }
}
// enkripsi cesar

// const plainText = "BOYHENRAWANPURBA";
// const Caesar = new CaesarChiper(plainText, 3);
// const encCaesar = Caesar.encrypt();
// const AESS = new AES(encCaesar, "KRIPTOGRAFIAESKU");
// const valCiper = AESS.encription();
// const AESDESC = AESS.desc(valCiper, "KRIPTOGRAFIAESKU");
// const originPlainText = Caesar.description(AESDESC);

// console.log(`\n\nPlian Text = ${plainText}
// Enkripsi Ceasar = ${encCaesar} Enkripsi AES = ${valCiper}
// Deskripsi AES = ${AESDESC} ,Dekripsi Ceasar = ${originPlainText}\n\n`);
