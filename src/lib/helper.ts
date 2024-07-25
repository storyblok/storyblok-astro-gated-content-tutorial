import { hash, verify } from "@node-rs/argon2";
import { generateId } from "lucia";
import { lucia } from "./auth";
import type { APIContext } from "astro";

//This is used for database column id
export function DBuuid() {
  return generateId(15);
}

const hashParameter = {
  memoryCost: 19456,
  timeCost: 2,
  outputLen: 32,
  parallelism: 1,
};
//Convert plain user password to a hash
export async function hashPassword(password: string) {
  return await hash(password, hashParameter);
}

//Validate plain user password with saved hash password
export async function validatePassword(hashPassword: string, password: string) {
  return await verify(hashPassword, password, hashParameter);
}

//Create session
export async function createSession(userId: string, context: APIContext) {
  try {
    const oneHourFromNow = new Date();
    oneHourFromNow.setHours(oneHourFromNow.getHours() + 1);
    const session = await lucia.createSession(userId, {
      expiresAt: oneHourFromNow.getTime(),
      userId,
    });
    const sessionCookie = lucia.createSessionCookie(session.id);
    context.cookies.set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );
  } catch (error) {
    console.log(error);
  }
}

//Just a wrapper around Response
export function ErrorResponse(message: string, status: number = 400) {
  return new Response(
    JSON.stringify({
      error: message,
      sucess: false,
    }),
    {
      status,
    }
  );
}

//Basic username validation
export function isValidUsername(username: string): boolean {
  return typeof username === "string" && /^[a-z0-9_-]{3,31}$/.test(username);
}

//Basic password validation
export function isValidPassword(password: string): boolean {
  return (
    typeof password === "string" &&
    password.length >= 6 &&
    password.length <= 255
  );
}
