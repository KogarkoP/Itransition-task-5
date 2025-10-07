import styles from "./Header.module.css";
import Link from "next/link";
import logo from "@/assets/images/logo.png";
import * as Icon from "react-bootstrap-icons";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/router";

const Header = () => {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setLoggedIn] = useState(false);
  const router = useRouter();

  const toggleMenu = () => {
    setMenuOpen((prevState) => !prevState);
  };

  const onLogout = () => {
    Cookies.remove("@user_jwt");
    setLoggedIn(false);
    router.replace("/login");
  };

  useEffect(() => {
    document.documentElement.style.overflow = isMenuOpen ? "hidden" : "";
  }, [isMenuOpen]);

  useEffect(() => {
    const jwt = Cookies.get("@user_jwt");
    if (jwt) {
      setLoggedIn(true);
    }
  }, []);

  return (
    <div className={styles.main}>
      <div className={styles.logo_wrapper}>
        <Link href={"/"}>
          <img src={logo.src} alt="TECH Forum" />
        </Link>
      </div>
      <ul className={styles.nav}>
        <li>
          <Link href={"/"}>Users</Link>
        </li>
        <li className={styles.login}>
          {isLoggedIn ? (
            <button onClick={onLogout}>
              <Icon.BoxArrowRight />
              Logout
            </button>
          ) : (
            <Link href={"/login"}>
              <Icon.BoxArrowInRight />
              Login/Register
            </Link>
          )}
        </li>
      </ul>
      <button className={styles.mobile_menu_bttn} onClick={toggleMenu}>
        <Icon.List />
      </button>
      {isMenuOpen && (
        <div className={styles.mobile_menu_wrapper} onClick={toggleMenu}>
          <div
            className={styles.mobile_menu}
            onClick={(e) => e.stopPropagation()}
          >
            <Icon.X className={styles.close_bttn} onClick={toggleMenu} />
            <ul>
              <li className={styles.login_con}>
                {isLoggedIn ? (
                  <button onClick={onLogout}>
                    <Icon.BoxArrowRight />
                    Logout
                  </button>
                ) : (
                  <a href={"/login"}>
                    <Icon.BoxArrowInRight />
                    Login/Register
                  </a>
                )}
              </li>
              <li>
                <a href={"/"}>Users</a>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
