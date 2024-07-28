"use server";

import { signIn } from "@/auth";

const githubProvider = async () => {
  await signIn("github");
};
const googleProvider = async () => {
  await signIn("google");
};
export { githubProvider, googleProvider };
