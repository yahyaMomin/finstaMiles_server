import optGenerator from "otp-generator";

const generateOpt = () => {
  const opt = optGenerator.generate(6, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
    digits: true,
  });
  return opt;
};

export default generateOpt;
