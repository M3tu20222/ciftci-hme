import ms, { StringValue } from "ms";
import jwt, { Secret, SignOptions } from "jsonwebtoken";

export function signToken(
  payload: string | object | Buffer,
  expiresIn: string | number = "1h"
): string {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in the environment variables");
  }

  // Convert "1h" to a numeric number of milliseconds or seconds
  // then cast accordingly, depending on how your types are set up:
  const expiresInTyped =
    typeof expiresIn === "string"
      ? (expiresIn as StringValue) // or cast to ms.StringValue
      : expiresIn;

  const options: SignOptions = { expiresIn: expiresInTyped };

  return jwt.sign(payload, process.env.JWT_SECRET as Secret, options);
}
