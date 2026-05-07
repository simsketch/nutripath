import { headers } from "next/headers";
import { Webhook } from "svix";
import { eq } from "drizzle-orm";
import type { WebhookEvent } from "@clerk/nextjs/server";
import { db } from "@/lib/db/client";
import { users } from "@/lib/db/schema";

export async function POST(req: Request) {
  const secret = process.env.CLERK_WEBHOOK_SECRET;
  if (!secret) {
    return new Response("CLERK_WEBHOOK_SECRET not configured", { status: 500 });
  }

  const headerPayload = await headers();
  const svixId = headerPayload.get("svix-id");
  const svixTimestamp = headerPayload.get("svix-timestamp");
  const svixSignature = headerPayload.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return new Response("Missing svix headers", { status: 400 });
  }

  const body = await req.text();

  let event: WebhookEvent;
  try {
    event = new Webhook(secret).verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Clerk webhook verification failed", err);
    return new Response("Invalid signature", { status: 400 });
  }

  switch (event.type) {
    case "user.created":
    case "user.updated": {
      const u = event.data;
      const primaryEmail =
        u.email_addresses.find((e) => e.id === u.primary_email_address_id)
          ?.email_address ?? u.email_addresses[0]?.email_address;
      if (!primaryEmail) break;

      await db
        .insert(users)
        .values({
          clerkId: u.id,
          email: primaryEmail,
          imageUrl: u.image_url ?? null,
        })
        .onConflictDoUpdate({
          target: users.clerkId,
          set: {
            email: primaryEmail,
            imageUrl: u.image_url ?? null,
            updatedAt: new Date(),
          },
        });
      break;
    }
    case "user.deleted": {
      const id = event.data.id;
      if (id) await db.delete(users).where(eq(users.clerkId, id));
      break;
    }
  }

  return new Response("ok", { status: 200 });
}
