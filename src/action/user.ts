"use server";

import connectDB from "@/lib/db";
import { User } from "@/models/User";
import { redirect } from "next/navigation";
import { hash } from "bcryptjs";
import { CredentialsSignin } from "next-auth";
import { signIn } from "@/auth";
const login = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("pass") as string;
  try {
    //console.log(email, password);
    await signIn("credentials", { redirect: false, callbackUrl: "/", email, password });
  } catch (error) {
    const someError = error as CredentialsSignin;
    return someError.cause;
  }
  redirect("/");
};

const register = async (formData: FormData) => {
  const fulname = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("pass") as string;

  if (!fulname || !email || !password) {
    throw new Error("Please fill add the fields.");
  }

  await connectDB();

  const existingUser = await User.findOne({ email });
  if (existingUser) throw new Error("User already exist");

  const hashedPass = await hash(password, 15);

  await User.create({ fulname, email, password: hashedPass });
  console.log(`user profile successfully created`);
  redirect("/login");
};

export { register, login };
