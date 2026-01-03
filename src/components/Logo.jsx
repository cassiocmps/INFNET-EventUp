import logoImage from "../assets/images/logo.png";
import styles from "./Logo.module.css";

export default function Logo({ size = "medium" }) {
  return <img className={styles[size]} src={logoImage} alt="EventUp" />;
}
