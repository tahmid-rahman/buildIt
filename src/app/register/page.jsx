"use client";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateAccount() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/users", {
        name,
        email,
        password,
      });
      router.push("/");
    } catch (error) {
      if (error.response && error.response.status === 400) {
        // Handle 400 Bad Request (email already exists)
        setError("Email already exist");
      } else {
        // Handle other errors
        console.log("Error creating user with account: ", error.response);
        setError("An error occurred");
      }
    }
  };

  return (
    <div className="">
      <div className="">
        <h2 className="">Create Account</h2>
        <hr className="" />
        <p className={error === "" ? "hidden" : "block text-red-500"}>{error}</p>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className="">
              Name
            </label>
            <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required className="" />
          </div>
          <div>
            <label htmlFor="email" className="">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className=""
            />
          </div>
          <div>
            <label htmlFor="password" className="">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className=""
            />
          </div>
          <button type="submit" className="">
            Create User
          </button>
        </form>
      </div>
    </div>
  );
}
