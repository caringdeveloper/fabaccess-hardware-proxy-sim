import express from "express";
import jwt from "jsonwebtoken";

interface ITokenValidRequest {
  Token: string;
}

export interface ITokenValidResponse {
  IsValid: boolean;
  DecodedToken: JWT;
}

interface JWT {
  id: string;
  scopes: string[];
}

const { JWT_SECRET_KEY } = process.env;

export function expressAuthentication(
  request: express.Request,
  securityName: string,
  scopes?: string[]
): Promise<any> {
  return new Promise(async (resolve, reject) => {
    if (securityName !== "Bearer")
      return reject(new Error("Unknown authentication method provided"));

    const token = request.headers["x-access-token"] as string;
    if (!token) return reject(new Error("No token provided"));

    try {
      const decoded = jwt.verify(token, JWT_SECRET_KEY) as JWT;
      const hasScopes = scopes.some(t => decoded.scopes.includes(t));

      if (!hasScopes) {
        return reject(
          new Error(
            `None of the provided scopes (${decoded.scopes}) fulfills the requirements of (${scopes})`
          )
        );
      }

      return resolve(decoded);
    } catch (err) {
      return reject(new Error("Provided token was not valid"));
    }
  });
}
