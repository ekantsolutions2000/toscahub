import jwt from "jsonwebtoken";
import { keys } from "./security";

export function getUser(accessToken) {
  return jwt.decode(accessToken);
}

export function validateToken(accessToken, cb) {
  jwt.verify(accessToken, keys.public, (err, decode) => {
    if (err) {
      cb(err);
    } else {
      cb(null);
    }
  });
}

export function validateTokenAsync(accessToken) {
  try {
    let decoded = jwt.verify(accessToken, keys.public);
    return { ...decoded, success: true };
  } catch (err) {
    return { ...err, success: false };
  }
}
