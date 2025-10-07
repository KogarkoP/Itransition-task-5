import { useState, useEffect } from "react";
import styles from "./UserRow.module.css";

type UserType = {
  id: string;
  name: string;
  email: string;
  verified: boolean;
  blocked: boolean;
  lastLogin: Date;
  usersIds: string[];
  setUsersIds: (usersIds: string) => void;
};

const UserRow = ({
  id,
  name,
  email,
  verified,
  blocked,
  lastLogin,
  usersIds,
  setUsersIds,
}: UserType) => {
  const status = blocked ? "Blocked" : verified ? "Active" : "Unverified";
  const lastSeen = new Date(lastLogin).toLocaleDateString(undefined, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  return (
    <tr className={styles.data_row}>
      <td className={styles.checkbox_con}>
        <input
          type="checkbox"
          id={id}
          checked={usersIds.includes(id)}
          onChange={() => {
            setUsersIds(id);
          }}
        />
      </td>
      <td>{name}</td>
      <td>{email}</td>
      <td>{status}</td>
      <td>{lastSeen}</td>
    </tr>
  );
};

export default UserRow;
