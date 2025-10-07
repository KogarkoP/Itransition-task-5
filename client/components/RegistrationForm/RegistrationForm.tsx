import { useState } from "react";
import { useRouter } from "next/router";
import { insertUser } from "@/pages/api/fetch";
import ModalTemplate from "../ModalTemplate/ModalTemplate";
import * as Icon from "react-bootstrap-icons";
import styles from "./RegistrationForm.module.css";
import Link from "next/link";

const RegistrationForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [termsPrivacy, setTermsPrivacy] = useState(false);
  const [password, setPassword] = useState("");
  const [isRegistered, setRegistered] = useState(false);
  const [isError, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const router = useRouter();

  const Submit = async () => {
    try {
      const newErrors: { [key: string]: string } = {};

      if (!name.trim()) newErrors.name = "Name field is required";
      if (!email.trim()) {
        newErrors.email = "Email field is required";
      } else if (!email.includes("@")) {
        newErrors.email = "Please enter a valid email address";
      }
      if (!password) {
        newErrors.password = "Password field is required";
      } else if (!/^\S+$/.test(password)) {
        newErrors.password = "Password must be atleast 1 character long";
      }
      if (!termsPrivacy)
        newErrors.termsPrivacy =
          "You must agree to the terms and privacy policy";

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      const user = {
        name: name,
        email: email,
        terms_privacy: termsPrivacy,
        password: password,
      };

      const response = await insertUser(user);
      if (response.status === 201) {
        setRegistered(true);
        setTimeout(() => router.push("/login"), 3000);
      }
    } catch (err: any) {
      const status = err.response?.status;
      setErrorMessage(
        status === 409
          ? "User with this email already exists"
          : "Something went wrong. Please try again."
      );

      setError(true);
      setTimeout(() => setError(false), 3000);
    }
  };

  return (
    <>
      {isError && (
        <ModalTemplate>
          <div className={`${styles.message} ${styles.error}`}>
            <Icon.XCircle />
            <p>{errorMessage}</p>
          </div>
        </ModalTemplate>
      )}
      {isRegistered && (
        <ModalTemplate>
          <div className={styles.message}>
            <Icon.CheckCircle className={styles.success} />
            <p>
              You Have Successfully Created an Account,
              <br />
              please verify your email
            </p>
          </div>
        </ModalTemplate>
      )}
      <div className={styles.main}>
        <h2>Registration</h2>
        <p className={styles.indication}>
          Enter your credentials to create your account
        </p>
        <div className={styles.form_row}>
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setErrors((prev) => {
                const { name, ...res } = prev;
                return res;
              });
            }}
          />
          {errors.name && <p className={styles.field_error}>{errors.name}</p>}
        </div>
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
                const { email, ...res } = prev;
                return res;
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
                const { password, ...res } = prev;
                return res;
              });
            }}
          />
          {errors.password && (
            <p className={styles.field_error}>{errors.password}</p>
          )}
        </div>
        <div className={styles.checkbox}>
          <div className={styles.checkbox_wrapper}>
            <input
              id="terms"
              type="checkbox"
              checked={termsPrivacy}
              onChange={(e) => {
                setTermsPrivacy(e.target.checked);
                setErrors((prev) => {
                  const { termsPrivacy, ...res } = prev;
                  return res;
                });
              }}
            />
            <label htmlFor="terms">
              I agree to the
              <span>
                <Link href={"/"}>Terms</Link>
              </span>
              &
              <span>
                <Link href={"/"}>Privacy Policy</Link>
              </span>
            </label>
          </div>
          {errors.termsPrivacy && (
            <p className={styles.field_error}>{errors.termsPrivacy}</p>
          )}
        </div>
        <button onClick={Submit}>Register</button>
        <div className={styles.login_con}>
          <p>
            Already have an account?
            <span>
              <Link href={"/login"}>Login</Link>
            </span>
          </p>
        </div>
      </div>
    </>
  );
};

export default RegistrationForm;
