import { Outlet } from "react-router-dom";
import styles from "./MainLayout.module.css";

export default function MainLayout(): React.ReactElement {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}
