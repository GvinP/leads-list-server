import decode from "jwt-decode";
import Token from "../models/model.js";
import fetch from "node-fetch";

export const getAccessToken = async () => {
  try {
    const accessToken = await Token.findOne({ type: "accessToken" });
    if (accessToken) {
      const decodedToken = decode(accessToken.token);
      if (decodedToken.exp * 1000 < new Date().getTime()) {
        const newAccesToken = await refreshTokens();
        return newAccesToken;
      } else {
        return accessToken.token;
      }
    }
  } catch (error) {
    console.log(error);
  }
};

export const refreshTokens = async () => {
  try {
    const refreshToken = await Token.findOne({ type: "refreshToken" });
    console.log("refreshToken : ", refreshToken.token);
    const body = {
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      grant_type: "refresh_token",
      refresh_token: refreshToken.token,
      redirect_uri: process.env.REDIRECT_URL,
    };

    const response = await fetch(
      `${process.env.AMOCRM_URL}/oauth2/access_token`,
      {
        method: "post",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
      }
    );
    const tokens = await response.json();
    console.log("tokens : ", tokens);

    await Token.findOneAndReplace(
      { type: "accessToken" },
      { type: "accessToken", token: tokens.access_token }
    );
    await Token.findOneAndReplace(
      { type: "refreshToken" },
      { type: "refreshToken", token: tokens.refresh_token }
    );
    return tokens.access_token;
  } catch (error) {
    console.log(error);
  }
};
