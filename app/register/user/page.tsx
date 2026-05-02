"use client";
import { useState, FormEvent, JSX } from "react";
import { useRouter } from 'next/navigation';
import { userSchema } from '../../auth/validation';
 
 
export default function UserRegister(): JSX.Element {
  const router = useRouter();
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [dob, setDob] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [successMsg, setSuccessMsg] = useState<string>("");
 
  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    setSuccessMsg("");
    setError("");
 
    const result = userSchema.safeParse({
      username,
      email,
      phone,
      password,
      dob
    });
 
    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }
    setSuccessMsg("Registration successful!");
    console.log(result.data);
    setUsername("");
    setEmail("");
    setPhone("");
    setPassword("");
    setDob("");
    setError("");
   
    setTimeout(() => router.push("/login"), 700);
  };
 
  return (
    <>
      <h1>User Registration</h1>
 
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="small letters only, no spaces"
          />
        </div>
 
        <div style={{ marginBottom: '15px' }}>
          <label>Personal Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
 
        <div style={{ marginBottom: '15px' }}>
          <label>Phone Number:</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="e.g. 01712345678"
          />
        </div>
 
        <div style={{ marginBottom: '15px' }}>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
 
        <div style={{ marginBottom: '15px' }}>
          <label>Date of Birth:</label>
          <input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
          />
        </div>
 
        {error && <p style={{ color: "red" }}>{error}</p>}
        {successMsg && <p style={{ color: "green" }}>{successMsg}</p>}
 
        <button type="submit">Register as User</button>
      </form>
    </>
  );
}