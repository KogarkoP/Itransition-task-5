import styles from "./PageTemplate.module.css";
import Header from "../Header/Header";

type PageTemplateProps = {
  children: React.ReactNode;
};

const PageTemplate = ({ children }: PageTemplateProps) => {
  return (
    <div className={styles.content_wrapper}>
      <Header />
      {children}
    </div>
  );
};

export default PageTemplate;
