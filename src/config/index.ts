import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  jwt: {
    access_token_secret: process.env.ACCESS_TOKEN_SECRET,
    access_token_expires_in: process.env.ACCESS_TOKEN_EXPIRES_IN,
    refresh_token_secret: process.env.REFRESH_TOKEN_SECRET,
    refresh_token_expires_in: process.env.REFRESH_TOKEN_EXPIRES_IN,
    forgot_password_token_secret: process.env.FORGOT_PASSWORD_TOKEN_SECRET,
    forgot_password_secret_expires_in:
      process.env.FORGOT_PASSWORD_SECRET_EXPIRES_IN,
  },
  reset_password_link: process.env.RESET_PASSWORD_LINK,
  email_send_from: process.env.EMAIL_SEND_FROM,
  email_sender_google_pass: process.env.EMAIL_SENDER_GOOGLE_PASS,
};
