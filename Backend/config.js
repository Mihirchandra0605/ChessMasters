import { configDotenv } from "dotenv";

configDotenv();

export const jwtSecretKey = process.env.JWT_SECRET_KEY;

if (jwtSecretKey == null || jwtSecretKey == "") {
  throw new Error("JWT_SECRET_KEY environment variable is not set!");
}
