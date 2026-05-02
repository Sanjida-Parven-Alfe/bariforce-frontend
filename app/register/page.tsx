"use client";

import { useRouter } from 'next/navigation';
import { JSX } from "react";

export default function RegisterSelection(): JSX.Element {
  const router = useRouter();

  return (
    <>
      <h1>Registration</h1>
      <p>Please select your role to continue registration:</p>

      <div>
        <label>Select Role: </label>
        <select 
          onChange={(e) => {
            const role = e.target.value;
            if (role) {
              router.push(`/register/${role}`);
            }
          }}
          defaultValue=""
        >
          <option value="" disabled>Select a role...</option>
          <option value="worker">Worker</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </select>
      </div>
    </>
  );
}
