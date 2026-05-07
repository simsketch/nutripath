import "server-only";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { users, type DbUser } from "@/lib/db/schema";

/**
 * Returns the current user's local DB row, creating it on first call.
 * Throws if there is no Clerk session — callers should run inside a
 * route protected by Clerk middleware (i.e. anything under (app)).
 */
export async function getCurrentUser(): Promise<DbUser> {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("getCurrentUser called without an authenticated session");
  }

  const existing = await db
    .select()
    .from(users)
    .where(eq(users.clerkId, userId))
    .limit(1);

  if (existing[0]) return existing[0];

  // JIT create — webhook may not have fired yet.
  const client = await clerkClient();
  const clerkUser = await client.users.getUser(userId);
  const primaryEmail =
    clerkUser.emailAddresses.find(
      (e) => e.id === clerkUser.primaryEmailAddressId,
    )?.emailAddress ?? clerkUser.emailAddresses[0]?.emailAddress;

  if (!primaryEmail) {
    throw new Error(`Clerk user ${userId} has no email address`);
  }

  const [created] = await db
    .insert(users)
    .values({
      clerkId: userId,
      email: primaryEmail,
      imageUrl: clerkUser.imageUrl,
    })
    .returning();

  return created;
}

export async function maybeCurrentUser(): Promise<DbUser | null> {
  const { userId } = await auth();
  if (!userId) return null;
  return getCurrentUser();
}
