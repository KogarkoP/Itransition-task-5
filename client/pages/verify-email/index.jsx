import styles from "./verify-email.module.css";
import PageTemplate from "@/components/PageTemplate/PageTemplate";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Alert, CircularProgress } from "@mui/material";
import { postRequest } from "../api/fetch";

const VerifyEmail = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  const emailToken = searchParams.get("emailToken");

  useEffect(() => {
    (async () => {
      if (user?.isVerified) {
        setTimeout(() => {
          return router.push("/");
        }, 3000);
      } else {
        if (emailToken) {
          setIsLoading(true);

          const response = await postRequest({ emailToken });

          setIsLoading(false);

          if (response.error) {
            return setError(response);
          }

          setUser(response);
        }
      }
    })();
  }, [emailToken, user]);

  return (
    <PageTemplate>
      <div className={styles.page_wrapper}>
        {isLoading ? (
          <div className={styles.progress}>
            <CircularProgress />
          </div>
        ) : (
          <div>
            {user?.isVerified ? (
              <div>
                <Alert severity="success">
                  Email successfully verified, redirecting...
                </Alert>
              </div>
            ) : (
              <div>
                {error.error ? (
                  <Alert severity="error">{error.message}</Alert>
                ) : null}
              </div>
            )}
          </div>
        )}
      </div>
    </PageTemplate>
  );
};

export default VerifyEmail;
