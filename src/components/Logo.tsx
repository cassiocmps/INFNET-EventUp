import logoImage from "../assets/images/logo.png";
import styles from "./Logo.module.css";

interface LogoProps {
  size?: "small" | "medium" | "large";
}

export default function Logo({ size = "medium" }: LogoProps) {
  return <img className={styles[size]} src={logoImage} alt="EventUp" />;
}
