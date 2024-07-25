import { verifyRequestOrigin } from "lucia";
import { defineMiddleware } from "astro:middleware";
import { lucia } from "~/lib/auth";

export const onRequest = defineMiddleware(async (context, next) => {
  //This is only because we are using https locally
  const isLocal = import.meta.env.RUNNING_LOCALLY === "yes";
  //This is to make sure we verify RequestOrigin
  if (context.request.method !== "GET" && !isLocal) {
    const originHeader = context.request.headers.get("Origin");
    const hostHeader = context.request.headers.get("Host");
    if (
      !originHeader ||
      !hostHeader ||
      !verifyRequestOrigin(originHeader, [hostHeader])
    ) {
      return new Response(null, {
        status: 403,
      });
    }
  }
  const sessionId = context.cookies.get(lucia.sessionCookieName)?.value ?? null;

  if (!sessionId) {
    context.locals.user = null;
    context.locals.session = null;
    return next();
  }

  const { session, user } = await lucia.validateSession(sessionId);
  if (!session) {
    const sessionCookie = lucia.createBlankSessionCookie();
    context.cookies.set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );
  }
  //There is a bug I think, checking it manually
  if (session) {
    const isSessionFresh = session?.expiresAt.getTime() > new Date().getTime();
    session.fresh = isSessionFresh;
  }

  if (session && session.fresh) {
    const sessionCookie = lucia.createSessionCookie(session.id);
    context.cookies.set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );
  }

  context.locals.session = session;
  context.locals.user = user;
  return next();
});
