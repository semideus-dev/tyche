import { db } from "@/lib/db";
import { User } from "@/lib/types";

export const createUser = async (user: User) => {
  const { clerkId, email, username, fullName, imgUrl } = user;

  const userData = {
    clerkId,
    email,
    username,
    fullName,
    imgUrl,
  };

  return await db.user.create({ data: userData });
};

export const updateUser = async (user: User) => {
  const { clerkId, email, username, fullName, imgUrl } = user;

  const userData = {
    clerkId,
    email,
    username,
    fullName,
    imgUrl,
  };

  return await db.user.update({
    where: { clerkId: user.clerkId },
    data: userData,
  });
};

export const deleteUser = async (clerkId: string) => {
  return await db.user.delete({ where: { clerkId: clerkId } });
};

export const getUserByClerkId = async (clerkId: string) => {
  return await db.user.findUnique({ where: { clerkId } });
};

export const getUserByEmail = async (email: string) => {
  return await db.user.findUnique({ where: { email } });
};

export const getUserById = async (id: number) => {
  return await db.user.findUnique({ where: { id } });
};


