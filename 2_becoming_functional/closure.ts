const zipCode = (code: string, location: string) => {
  let _code = code;
  let _location = location;

  return {
    code: () => _code,
    location: () => _location,
  };
}

const nestingCrosure = () => {
  const makeAddfunction = (amount: number) => {
    return (number: number) => number + amount;
  }

  const makeExponentialFunction = (exponent: number) => {
    return (base: number) => Math.pow(base, exponent);
  }

  const addTen = makeAddfunction(10);
  addTen(5); // 15

  const raiseTwoToThe = makeExponentialFunction(2);
  raiseTwoToThe(3); // 8
}

const closureScope = () => {
  const outerVar = "Outer";

  const makeInner = (params: string) => {
    const innerVar = "Inner";

    const inner = () => {
      console.log(
        `I can see: ${outerVar}, ${innerVar}, and ${params}`
      )
    }

    return inner;
  }

  const inner = makeInner("Params");
  inner()
}



