export const addCommasToNumber = (number: number) => {
  const numberString = number.toString();

  const [integerPart, decimalPart] = numberString.split(".");

  const integerArray = integerPart.split("");

  let formattedNumber = "";

  for (let i = integerArray.length - 1, commaCount = 0; i >= 0; i--) {
    if (commaCount === 3) {
      formattedNumber = "," + formattedNumber;
      commaCount = 0;
    }

    formattedNumber = integerArray[i] + formattedNumber;
    commaCount++;
  }

  if (decimalPart) {
    formattedNumber += "." + decimalPart;
  }

  return formattedNumber;
};
