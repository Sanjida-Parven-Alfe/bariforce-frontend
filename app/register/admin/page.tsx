"use client";
import { useState, FormEvent, JSX } from "react";
import { useRouter } from 'next/navigation';
import { adminSchema } from '../../auth/validation';


export default function AdminRegister(): JSX.Element {
  const router = useRouter();
  const [fullname, setFullname] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [accessCode, setAccessCode] = useState<string>("");
  const [adminLevel, setAdminLevel] = useState<string>("");
  const [experience, setExperience] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [successMsg, setSuccessMsg] = useState<string>("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    setSuccessMsg("");
    setError("");
   
    const expNumber = parseInt(experience, 10);
    const result = adminSchema.safeParse({ 
      fullname, 
      email, 
      accessCode, 
      adminLevel, 
      experience: isNaN(expNumber) ? undefined : expNumber 
    });

    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }
    setSuccessMsg("Registration successful!");
    console.log(result.data);
    setFullname("");
    setEmail("");
    setAccessCode("");
    setAdminLevel("");
    setExperience("");
    setError("");
    
    setTimeout(() => router.push("/login"), 700);
  };

  return (
    <>
      <h1>Admin Registration</h1>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label>Full Name:</label>
          <input
            type="text"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Official Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Access Code:</label>
          <input
            type="text"
            value={accessCode}
            onChange={(e) => setAccessCode(e.target.value)}
            maxLength={5}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Admin Level:</label>
          <select
            value={adminLevel}
            onChange={(e) => setAdminLevel(e.target.value)}
          >
            <option value="">Select Level</option>
            <option value="Super Admin">Super Admin</option>
            <option value="Moderator">Moderator</option>
          </select>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Experience Year:</label>
          <input
            type="number"
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            min="0"
          />
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}
        {successMsg && <p style={{ color: "green" }}>{successMsg}</p>}

        <button type="submit">Register as Admin</button>
      </form>
    </>
  );
}
