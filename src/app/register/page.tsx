import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import React from "react";

function page() {
  return (
    <>
      <ThemeToggle />
      <div className="flex justify-center items-center h-[90vh]">
        <div className="w-[400px] border-[1px] border-black dark:border-[#262626] px-5 py-7 rounded-xl">
          <p className="w-fit mx-auto my-4 font-bold text-2xl">Sign up</p>
          <form action="" className="">
            <Input
              className="my-2 shadow-md dark:shadow-gray-950"
              placeholder="Fullname"
              id="name"
              name="name"
              type="text"
              required
            />
            <Input
              className="my-2 shadow-md dark:shadow-gray-950"
              placeholder="Email"
              id="email"
              name="email"
              type="email"
              required
            />
            <Input
              className="my-2 shadow-md dark:shadow-gray-950"
              placeholder="Password"
              id="pass"
              name="pass"
              type="password"
              required
            />
            <Button className="w-full">Sumbit &rarr;</Button>
          </form>
          <div className="w-fit ml-auto text-sm font-thin my-1">
            Have an account? &nbsp;
            <Link href={"/login"} className="underline">
              Login
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default page;
