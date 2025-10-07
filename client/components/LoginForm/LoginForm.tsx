import styles from "./LoginForm.module.css";
import Cookies from "js-cookie";
import ModalTemplate from "../ModalTemplate/ModalTemplate";
import Link from "next/link";
import * as Icon from "react-bootstrap-icons";
import { useState } from "react";
import { login } from "@/pages/api/fetch";
import { useRouter } from "next/router";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isError, setError] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const router = useRouter();

  const onSubmit = async () => {
    try {
      const newErrors: { [key: string]: string } = {};
      if (!email) {
        newErrors.email = "Email field is required";
      } else if (!email.includes("@")) {
        newErrors.email = "Please enter a valid email address";
      }
      if (!password) newErrors.password = "Password field is required";

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      const loginData = {
        email: email,
        password: password,
      };

      const response = await login(loginData);

      if (response.data.user.isBlocked === true) {
        setIsBlocked(true);
        setTimeout(() => setIsBlocked(false), 4000);
        return;
      }

      if (response.status === 200) {
        Cookies.set("@user_jwt", response.data.jwt);
        setLoggedIn(true);
        setTimeout(() => router.push("/"), 3000);
      }

      setEmail("");
      setPassword("");
    } catch (err) {
      setError(true);
      setTimeout(() => setError(false), 3000);
    }
  };

  return (
    <>
      {(isError || isBlocked) && (
        <ModalTemplate>
          <div className={`${styles.message} ${styles.error}`}>
            <Icon.XCircle />
            <p>
              {isBlocked
                ? "Your account has been blocked. Please contact support."
                : "Your Email or Password is wrong"}
            </p>
          </div>
        </ModalTemplate>
      )}
      {isLoggedIn && (
        <ModalTemplate>
          <div className={styles.message}>
            <Icon.CheckCircle className={styles.success} />
            <p>You Have Successfully Logged In, redirecting...</p>
          </div>
        </ModalTemplate>
      )}
      <div className={styles.main}>
        <h2>Login</h2>
        <p className={styles.indication}>
          Enter your email and password to access your account
        </p>
        <div className={styles.form_row}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrors((prev) => {
                const { email, ...rest } = prev;
                return rest;
              });
            }}
          />
          {errors.email && <p className={styles.field_error}>{errors.email}</p>}
        </div>
        <div className={styles.form_row}>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setErrors((prev) => {
                const { password, ...rest } = prev;
                return rest;
              });
            }}
          />
          {errors.password && (
            <p className={styles.field_error}>{errors.password}</p>
          )}
        </div>
        <button onClick={onSubmit}>Login</button>
        <div className={styles.register_con}>
          <p>
            Don&apos;t Have An Account?
            <span>
              <Link href={"/register"}>Register Now</Link>
            </span>
          </p>
        </div>
      </div>
    </>
  );
};

export default LoginForm;
