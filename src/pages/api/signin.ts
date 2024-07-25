import type { APIContext } from "astro";
import { db, eq, User } from "astro:db";
import {
  createSession,
  isValidPassword,
  isValidUsername,
  ErrorResponse,
  validatePassword,
} from "~/lib/helper";

export async function POST(context: APIContext): Promise<Response> {
  const formData = await context.request.formData();
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  // Basic validation
  if (!isValidUsername(username) || !isValidPassword(password)) {
    return ErrorResponse("Invalid username or password");
  }
  //Check if user exist
  const [existingUser] = await db
    .select()
    .from(User)
    .where(eq(User.username, username));

  if (
    !existingUser ||
    !(await validatePassword(existingUser.passwordHash, password))
  ) {
    return ErrorResponse("Incorrect username or password");
  }

  await createSession(existingUser.id, context);

  return new Response(
    JSON.stringify({
      sucess: true,
    })
  );
}
