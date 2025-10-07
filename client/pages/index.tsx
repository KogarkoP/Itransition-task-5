import styles from "@/styles/Home.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import PageTemplate from "@/components/PageTemplate/PageTemplate";
import UserRow from "@/components/UserRow/UserRow";
import * as Icon from "react-bootstrap-icons";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { User } from "@/types/user";
import { deleteUsersByIds, getAllUsers, updateUsersByIds } from "./api/fetch";
import { FilterOption } from "@/types/filterOption";
import NothingFound from "@/assets/images/find.png";

const MainPage = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [usersIds, setUsersIds] = useState<string[]>([]);
  const [filter, setFilter] = useState<FilterOption>("all");
  const router = useRouter();

  const fetchUsers = async () => {
    const response = await getAllUsers();
    setUsers(response.data.users);
  };

  const filteredUsers = users
    .filter((user) => {
      if (filter === "blocked") return user.isBlocked;
      if (filter === "unverified") return !user.isVerified && !user.isBlocked;
      if (filter === "active") return !user.isBlocked && user.isVerified;
      return true;
    })
    .sort((a, b) => {
      if (filter === "newest")
        return (
          new Date(b.lastLogin).getTime() - new Date(a.lastLogin).getTime()
        );
      if (filter === "oldest")
        return (
          new Date(a.lastLogin).getTime() - new Date(b.lastLogin).getTime()
        );
      return 0;
    });

  const toggleCheckboxes = () => {
    if (!users) return;

    setUsersIds((prevIds) => {
      const allIds = filteredUsers.map((user) => user.id);
      const allSelected = allIds.every((id) => prevIds.includes(id));

      return allSelected ? [] : allIds;
    });
  };

  const deleteUsers = async (usersIds: string[]) => {
    try {
      const response = await deleteUsersByIds(usersIds);
      setUsersIds([]);
      fetchUsers();
    } catch (error) {
      console.log("Error deleting user:", error);
    }
  };

  const updateUsers = async (usersIds: string[], statusUpdate: boolean) => {
    try {
      console.log(usersIds);
      const response = await updateUsersByIds({
        usersIds,
        update: { isBlocked: statusUpdate },
      });
      setUsersIds([]);
      fetchUsers();
    } catch (error) {
      console.log("Error updating user:", error);
    }
  };

  const selectedUsersIds = (userId: string) => {
    setUsersIds((prev) => {
      if (prev.includes(userId)) {
        return prev.filter((id) => id !== userId);
      } else {
        return [...prev, userId];
      }
    });
  };

  useEffect(() => {
    const token = Cookies.get("@user_jwt");
    if (!token) {
      router.replace("/login");
    } else {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    if (!loading) {
      fetchUsers();
    }
  }, [loading]);

  useEffect(() => {
    setUsersIds([]);
  }, [filter]);

  if (loading) return null;

  return (
    <PageTemplate>
      <div className={styles.main}>
        <div className={styles.toolbar}>
          <ul className={styles.buttons_wrapper}>
            <li>
              <Button
                className={styles.block_btn}
                disabled={usersIds.length === 0}
                onClick={() => {
                  updateUsers(usersIds, true);
                }}
              >
                <Icon.LockFill />
                Block
              </Button>
            </li>
            <li>
              <Button
                className={styles.unblock_btn}
                disabled={usersIds.length === 0}
                onClick={() => {
                  updateUsers(usersIds, false);
                }}
              >
                <Icon.UnlockFill />
              </Button>
            </li>
            <li>
              <Button
                disabled={usersIds.length === 0}
                onClick={() => {
                  deleteUsers(usersIds);
                }}
                className="btn btn-danger"
              >
                <Icon.Trash3Fill />
              </Button>
            </li>
          </ul>
          <ul className={styles.filter_wrapper}>
            <li>
              <select
                name="filter"
                id="filter"
                defaultValue="all"
                value={filter}
                onChange={(e) => setFilter(e.target.value as FilterOption)}
              >
                <option value="all">All</option>
                <option value="blocked">Blocked</option>
                <option value="unverified">Unverified</option>
                <option value="active">Active</option>
                <option value="newest">Newest by login</option>
                <option value="oldest">Oldest by login</option>
              </select>
            </li>
          </ul>
        </div>
        {filteredUsers && filteredUsers.length > 0 ? (
          <table className={styles.users_table}>
            <thead>
              <tr className={styles.table_heading}>
                <td className={styles.checkbox_con}>
                  <input
                    type="checkbox"
                    id="select_all"
                    checked={
                      filteredUsers.length > 0 &&
                      filteredUsers.every((u) => usersIds.includes(u.id))
                    }
                    onChange={() => {
                      toggleCheckboxes();
                    }}
                  />
                </td>
                <td>Name</td>
                <td>Email</td>
                <td>Status</td>
                <td>Last seen</td>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => {
                return (
                  <UserRow
                    key={user.id}
                    id={user.id}
                    name={user.name}
                    email={user.email}
                    verified={user.isVerified}
                    blocked={user.isBlocked}
                    lastLogin={user.lastLogin}
                    setUsersIds={selectedUsersIds}
                    usersIds={usersIds}
                  />
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className={styles.notification_wrapper}>
            <div className={styles.nothing_found_con}>
              <img src={NothingFound.src} alt="Nothing found" />
            </div>
            <p>No Users Found....</p>
          </div>
        )}
      </div>
    </PageTemplate>
  );
};

export default MainPage;
