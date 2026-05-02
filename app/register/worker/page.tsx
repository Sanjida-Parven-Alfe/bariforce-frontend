"use client";
import { useState, ChangeEvent, FormEvent, JSX } from "react";
import { useRouter } from 'next/navigation';
import { workerSchema } from '../../auth/validation';


export default function WorkerRegister(): JSX.Element {
  const router = useRouter();
  const [fullname, setFullname] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [workertype, setWorkertype] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [successMsg, setSuccessMsg] = useState<string>("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    setSuccessMsg("");
    setError("");
   

    const result = workerSchema.safeParse({ fullname, email, password, phone, workertype });

    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }
    setSuccessMsg("Registration successful!");
    console.log(result.data);
    setFullname("");
    setEmail("");
    setPassword("");
    setPhone("");
    setWorkertype("");
    setError("");
    

    setTimeout(() => router.push("/login"), 700);
  };

  return (
    <>
      <h1>Worker Registration</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Full Name:</label>
          <input
            type="text"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
          />
        </div>

        <div>
          <label>Email :</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label>Password :</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div>
          <label>Phone:</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <div>
          <label>Worker Type</label>
          <select
            value={workertype}
            onChange={(e) => setWorkertype(e.target.value)}
          >
            <option value="">Select type</option>
            <option value="electrician">Electrician</option>
            <option value="plumber">Plumber</option>
            <option value="cook">Cook</option>
            <option value="maid">Maid</option>
            <option value="driver">Driver</option>
            <option value="security">Security Guard</option>
          </select>
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}
        {successMsg && <p style={{ color: "green" }}>{successMsg}</p>}

        <button type="submit">Register as Worker</button>
      </form>
    </>
  );
}