import { createUser, updateUser, deleteUser } from "@/lib/actions/user.actions";
import { WebhookEvent } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { Webhook } from "svix";

export async function POST(req: Request) {
  const SIGNING_SECRET = process.env.SIGNING_SECRET;

  if (!SIGNING_SECRET) {
    throw new Error(
      "Error: Please add SIGNING_SECRET from Clerk Dashboard to .env or .env.local",
    );
  }

  // Create new Svix instance with secret
  const wh = new Webhook(SIGNING_SECRET);

  // Get headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error: Missing Svix headers", {
      status: 400,
    });
  }

  // Get body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  let evt: WebhookEvent;

  // Verify payload with headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error: Could not verify webhook:", err);
    return new Response("Error: Verification error", {
      status: 400,
    });
  }

  // Do something with payload
  // For this guide, log payload to console
  const { id } = evt.data;
  const eventType = evt.type;

  if (eventType === "user.created") {
    const { id, email_addresses, username, first_name, last_name, image_url } =
      evt.data;

    if (!email_addresses[0] || !username) {
      return new Response("Error: user data is missing", {
        status: 400,
      });
    }

    const newUser = {
      clerkId: id,
      email: email_addresses[0]?.email_address,
      username,
      fullName: `${first_name} ${last_name}`,
      imgUrl: image_url,
    };

    await createUser(newUser);
  } else if (eventType === "user.deleted") {
    const { id } = evt.data;

    if (!id) {
      return new Response("Error: user id is missing", {
        status: 400,
      });
    }

    await deleteUser(id);
  } else if (eventType === "user.updated") {
    const { id, email_addresses, username, first_name, last_name, image_url } =
      evt.data;

    if (!email_addresses[0] || !username) {
      return new Response("Error: user data is missing", {
        status: 400,
      });
    }

    const updatedUser = {
      clerkId: id,
      email: email_addresses[0].email_address,
      username,
      fullName: `${first_name} ${last_name}`,
      imgUrl: image_url,
    };

    await updateUser(updatedUser);
  }

  return new Response("Webhook received", { status: 200 });
}
