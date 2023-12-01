import dotenv from "dotenv";

dotenv.config();

const sendEmail = async (email, fullName, opt) => {
  console.log(email, fullName, opt);
};
export default sendEmail;
