// Frist Step
function plainIntoBinner(tes) {
  // change senetence to binner
  const binner = tes.split("").map((e, i) => {
    //    return e.charCodeAt(0).toString(2);
    let result = e.charCodeAt(0).toString(2);
    if (result.length != 8) {
      result = "0" + result;
    }
    return result;
  });
  // get initial Permutaion with table default
  const tableDefaultPlainText = [
    [58, 50, 42, 34, 26, 18, 10, 2],
    [60, 52, 44, 36, 28, 20, 12, 4],
    [62, 54, 46, 38, 30, 22, 14, 6],
    [64, 56, 48, 40, 32, 24, 16, 8],
    [57, 49, 41, 33, 25, 17, 9, 1],
    [59, 51, 43, 35, 27, 19, 11, 3],
    [61, 53, 45, 37, 29, 21, 13, 5],
    [63, 55, 47, 39, 31, 23, 15, 7],
  ];
  // console.log(binner.join(""));
  const getIP = initialPermutasi(binner.join(""), tableDefaultPlainText);
  //    return L0 and R0
  return getIP.split(",");
}
function initialPermutasi(plainText, deFunction) {
  let i = 0;
  let result = [];
  while (deFunction.length > i) {
    for (let j = 0; j < deFunction[i].length; j++) {
      result.push(plainText[deFunction[i][j] - 1]);
    }
    if (i == 3) {
      result.push(",");
    }
    i++;
  }
  return result.join("");
}

function fixedLengthBinner(string1, length, char) {
  return string1.length == length ? string1 : fixedLengthBinner(char + string1, length, char);
}
// process key  (Second Steps and Trith steps)
function keyIntoBinner(string) {
  let result = "";
  if (string.length == 16) {
    result = string
      .split("")
      .map((e) => {
        let tmpCheck = parseInt(e);
        if (isNaN(tmpCheck)) {
          tmpCheck = Number.parseInt(e, 16);
        }
        tmpCheck = tmpCheck.toString(2);
        console.log(`${e} = ${fixedLengthBinner(tmpCheck, 4, "0")}`);
        return fixedLengthBinner(tmpCheck, 4, "0");
      })
      .join("");

    // generate dataTable default
    const dataTableKey = [
      [57, 49, 41, 33, 25, 17, 9],
      [1, 58, 50, 42, 34, 26, 18],
      [10, 2, 59, 51, 43, 35, 27],
      [19, 11, 3, 60, 52, 44, 36],
      [63, 55, 47, 39, 31, 23, 15],
      [7, 62, 54, 45, 38, 30, 22],
      [14, 6, 61, 53, 45, 37, 29],
      [21, 13, 5, 28, 20, 12, 4],
    ];

    return initialPermutasi(result, dataTableKey).split(",");
  } else {
    console.log(2);
    return plainIntoBinner(string);
  }
}

// the fourth Steps
function moved(c, d) {
  const k = ["0"];
  const tablePc2 = [
    [14, 17, 11, 24, 1, 5],
    [3, 28, 15, 6, 21, 10],
    [23, 19, 12, 4, 26, 8],
    [16, 7, 27, 20, 13, 2],
    [41, 52, 31, 37, 47, 55],
    [30, 40, 51, 45, 33, 48],
    [44, 49, 39, 56, 34, 53],
    [46, 42, 50, 36, 29, 32],
  ];
  const defaultTbaleMoved = [1, 1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1];
  let i = 1;
  while (16 >= i) {
    let tmpArrayC = c[i - 1];
    let tmpArrayD = d[i - 1];
    for (let j = 1; j <= defaultTbaleMoved[i - 1]; j++) {
      // this moved for C
      // get frist element
      let tmpDataC = tmpArrayC[0];
      // delete
      let resultC = tmpArrayC.split("");
      resultC.splice(0, 1);
      //push at the last
      resultC.push(tmpDataC);
      // save the  changes and  return back  as string
      tmpArrayC = resultC.join("");
      // end moved C

      // start Moved D
      // get frist element
      let tmpDataD = tmpArrayD[0];
      // delete
      let resultD = tmpArrayD.split("");
      resultD.splice(0, 1);
      //push at the last
      resultD.push(tmpDataD);
      // save the  changes and  return back  as string
      tmpArrayD = resultD.join("");
      // end moved D
    }
    //    if moved has been finished get new data
    c.push(tmpArrayC);
    d.push(tmpArrayD);
    // console.log(`Digeser ${defaultTbaleMoved[i - 1]}  bit hasilnya`);
    // console.log(`C${i} :` + tmpArrayC);
    // console.log(`D${i} :` + tmpArrayD + "\n");

    let tmpK = initialPermutasi(tmpArrayC + tmpArrayD, tablePc2);
    k.push(tmpK.replace(",", ""));
    // langkah ke-4
    // console.log(`C${i}D${i} :` + tmpArrayC + tmpArrayD);
    // console.log(`K${i} : ${tmpK}\n`);
    i++;
  }
  return [c, d, k];
}
// fiveth to seventh steps
function generateRandL(r, key) {
  const resultA = [];
  const arrayB = [];
  const arrayPB = [];
  for (let i = 1; i <= 16; i++) {
    const expR = expension(r[i - 1]);
    // to calculate er with key-i
    const tmpResult = XOR(expR, key[i]);
    // // langkah ke 5
    // console.log(`Iterasi  ${i}`);
    // console.log(`E(R(${i})-1)  = ${expR.join("")}`);
    // console.log(`K${i}          = ${key[i]}`);
    // console.log(`---------------------------------------------------------------------------------------- XOR`);
    // console.log(`A${i}          =${tmpResult.join("")}\n`);
    resultA.push(tmpResult.join(""));
    // generate  value b
    const b = sBox(tmpResult);
    arrayB.push(b);
    // //langkah ke-7
    // console.log(`B${i} = ${b}`);

    // generate value P-Box from b
    const defaultTablePBox = [
      [16, 7, 20, 21, 29, 12, 28, 17],
      [1, 15, 23, 26, 5, 18, 31, 10],
      [2, 8, 24, 14, 32, 27, 3, 9],
      [19, 13, 30, 6, 22, 11, 4, 25],
    ];
    let pb = initialPermutasi(b, defaultTablePBox);
    arrayPB.push(pb);
    // to earse the comma at the end
    pb = pb.slice(0, -1);

    // langka ke-8
    // console.log(`P(B${i}) = ${pb}`);

    const tmpR = XOR(pb, l[i - 1]).join("");
    // cause value R is apart form L we save to l
    r.push(tmpR);

    // langkah ke8.1
    // console.log(`P(B${i})   = ${pb}`);
    // console.log(`L(${i}-1)  = ${l[i - 1]}`);
    // console.log(`---------------------------------------------------------------------------------------- XOR`);
    // console.log(`R${i}      = ${tmpR}\n`);

    if (i != 16) l.push(tmpR);
  }
  return [resultA, arrayB, arrayPB];
}
function XOR(fristVal, secondVal) {
  const result = [];
  for (let j = 0; j < fristVal.length; j++) {
    // check XOR betweeen E(R) and Key
    if (fristVal[j] == secondVal[j]) {
      result.push("0");
    } else result.push("1");
  }
  return result;
}
function expension(e) {
  const tExpansi = [32, 1, 2, 3, 4, 5, 4, 5, 6, 7, 8, 9, 8, 9, 10, 11, 12, 13, 12, 13, 14, 15, 16, 17, 16, 17, 18, 19, 20, 21, 20, 21, 22, 23, 24, 25, 24, 25, 26, 27, 28, 29, 28, 29, 30, 31, 32, 1];
  let result = [];
  for (let i = 0; i < tExpansi.length; i++) {
    result.push(e[tExpansi[i] - 1]);
  }
  return result;
}
function sBox(a) {
  const defaultSBox = [
    [
      [14, 4, 13, 1, 2, 15, 11, 8, 3, 10, 6, 12, 5, 9, 0, 7],
      [0, 15, 7, 4, 14, 2, 13, 1, 10, 6, 12, 11, 9, 5, 3, 8],
      [4, 1, 14, 8, 13, 6, 2, 11, 15, 12, 9, 7, 3, 10, 5, 0],
      [15, 12, 8, 2, 4, 9, 1, 7, 5, 11, 3, 14, 10, 0, 6, 13],
    ],
    [
      [15, 1, 8, 14, 6, 11, 3, 4, 9, 7, 2, 13, 12, 0, 5, 10],
      [3, 13, 4, 7, 15, 2, 8, 14, 12, 0, 1, 10, 6, 9, 11, 5],
      [0, 14, 7, 11, 10, 4, 13, 1, 5, 8, 12, 6, 9, 3, 2, 15],
      [13, 8, 10, 1, 3, 15, 4, 2, 11, 6, 7, 12, 0, 5, 14, 9],
    ],
    [
      [10, 0, 9, 14, 6, 3, 15, 5, 1, 13, 12, 7, 11, 4, 2, 8],
      [13, 7, 0, 9, 3, 4, 6, 10, 2, 8, 5, 14, 12, 11, 15, 1],
      [13, 6, 4, 9, 8, 15, 3, 0, 11, 1, 2, 12, 5, 10, 14, 7],
      [1, 10, 13, 0, 6, 9, 8, 7, 4, 15, 14, 3, 11, 5, 2, 12],
    ],
    [
      [7, 13, 14, 3, 0, 6, 9, 10, 1, 2, 8, 5, 11, 12, 4, 15],
      [13, 8, 11, 5, 6, 15, 0, 3, 4, 7, 2, 12, 1, 10, 14, 9],
      [10, 6, 9, 0, 12, 11, 7, 13, 15, 1, 3, 14, 5, 2, 8, 4],
      [3, 15, 0, 6, 10, 1, 13, 8, 9, 4, 5, 11, 12, 7, 2, 14],
    ],
    [
      [2, 12, 4, 1, 7, 10, 11, 6, 8, 5, 3, 15, 13, 0, 14, 9],
      [14, 11, 2, 12, 4, 7, 13, 1, 5, 0, 15, 10, 3, 9, 8, 16],
      [4, 2, 1, 11, 10, 13, 7, 8, 15, 9, 12, 5, 6, 3, 0, 14],
      [11, 8, 12, 7, 1, 14, 2, 13, 6, 15, 0, 9, 10, 4, 5, 3],
    ],
    [
      [12, 1, 10, 15, 9, 2, 6, 8, 0, 13, 3, 4, 14, 7, 5, 11],
      [10, 15, 4, 2, 7, 12, 9, 5, 6, 1, 13, 14, 0, 11, 3, 8],
      [9, 14, 15, 5, 2, 8, 12, 3, 7, 0, 4, 10, 1, 13, 11, 6],
      [4, 3, 2, 12, 9, 5, 15, 10, 11, 14, 1, 7, 6, 0, 8, 13],
    ],
    [
      [4, 11, 2, 14, 15, 0, 8, 13, 3, 12, 9, 7, 5, 10, 6, 1],
      [13, 0, 11, 7, 4, 9, 1, 10, 14, 3, 5, 12, 2, 15, 8, 6],
      [1, 4, 11, 13, 12, 3, 7, 14, 10, 15, 6, 8, 0, 5, 9, 2],
      [6, 11, 13, 8, 1, 4, 10, 7, 9, 5, 0, 15, 14, 2, 3, 12],
    ],
    [
      [13, 2, 8, 4, 6, 15, 11, 1, 10, 9, 3, 14, 5, 0, 12, 7],
      [1, 15, 13, 8, 10, 3, 7, 4, 12, 5, 6, 11, 0, 14, 9, 2],
      [7, 11, 4, 1, 9, 12, 14, 2, 0, 6, 10, 13, 15, 3, 5, 8],
      [2, 1, 14, 7, 4, 10, 8, 13, 15, 12, 9, 0, 3, 5, 6, 11],
    ],
  ];
  const result = [];
  for (let i = 1; i <= 8; i++) {
    // get each part with length 6
    let tmpArray = a.slice((i - 1) * 6, i * 6);
    // get index at the right of sbox
    const y = Number.parseInt(tmpArray[0] + tmpArray[5], 2);
    // deleted
    tmpArray.pop();
    tmpArray.splice(0, 1);
    // get index at the upper from the SBOX
    const x = Number.parseInt(tmpArray.join(""), 2);
    // getData from sBox and convert to binner and fix length of binner
    const tmpResult = fixedLengthBinner(defaultSBox[i - 1][y][x].toString(2), 4, "0");
    result.push(tmpResult);
  }
  return result.join("");
}
// eigth steps (final)
function resultEnc(val_lastR, val_lastL) {
  // default Table IP^-1
  const defaultTbaleIP = [
    [40, 8, 48, 16, 56, 24, 64, 32],
    [39, 7, 47, 15, 55, 23, 63, 31],
    [38, 6, 46, 14, 54, 22, 62, 30],
    [37, 5, 45, 13, 53, 21, 61, 29],
    [36, 4, 44, 12, 52, 20, 60, 28],
    [35, 3, 43, 11, 51, 19, 59, 27],
    [34, 2, 42, 10, 50, 18, 58, 26],
    [33, 1, 41, 9, 49, 17, 57, 25],
  ];
  let combineAndMutation = initialPermutasi(val_lastR + val_lastL, defaultTbaleIP);
  // because at the intial permutaion retrun with comma  i must disapear that
  [fristResult, secondResult] = combineAndMutation.split(",");

  return fristResult + secondResult;
}

// PLAIN TEXT
const plainText = "ILOVEYOU";
[l0, r0] = plainIntoBinner(plainText);
// get L and R

let l = [l0];
let r = [r0];
console.log("Plain text");
console.log(l[0], r[0]);
// because li=Ri-1 so we can value of r to R
l.push(r0);

// // key

let tes = "123458899AACD231";
[c0, d0] = keyIntoBinner(tes);
let c = [c0];
let d = [d0];
console.log("Key");
console.log(c[0], d[0]);
// moved
console.log("Moved Data");
[a, b, z] = moved(c, d);
// updated array C and D from moved
c = a;
d = b;
let k = z;
// console.log("langkah ke-4");

const [arrayA, arrayB, arrayPB] = generateRandL(r, k);

/* 
at the step 8 we must calculate r[16]+l[16] and made Permutasi from table Ip^-1 
to get the result
*/
const resultEncryption = resultEnc(r[16], l[16]);
console.log("R16L16               = " + r[16] + l[16]);

console.log("Chiper Dalam Binner  =  " + resultEncryption);
