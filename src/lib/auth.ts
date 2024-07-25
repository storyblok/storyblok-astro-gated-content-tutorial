import { Lucia } from "lucia";
import { db, Session, User } from "astro:db";
import { DrizzleSQLiteAdapter } from "@lucia-auth/adapter-drizzle";

const adapter = new DrizzleSQLiteAdapter(db as any, Session, User);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: true,
    },
  },
  getUserAttributes: (attributes) => {
    return {
      username: attributes.username,
      name: attributes.name,
    };
  },
});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
    DatabaseSessionAttributes: DatabaseSessionAttributes;
  }
}
interface DatabaseUserAttributes {
  username: string;
  name: string;
}
interface DatabaseSessionAttributes {
  expiresAt: number;
  userId: string;
}
