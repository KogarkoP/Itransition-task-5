import styles from "./login.module.css";
import PageTemplate from "@/components/PageTemplate/PageTemplate";
import LoginForm from "@/components/LoginForm/LoginForm";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const Login = () => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("@user_jwt");

    if (token) {
      router.replace("/");
    } else {
      setLoading(false);
    }
  }, [router]);

  if (loading) return null;

  return (
    <PageTemplate>
      <div className={styles.main}>
        <LoginForm />
      </div>
    </PageTemplate>
  );
};

export default Login;
