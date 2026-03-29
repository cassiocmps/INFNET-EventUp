import type { Role } from "types";
import styles from "./RoleSelector.module.css";

interface RoleSelectorProps {
  roles: Role[];
  selectedRole: string;
  onChange: (roleId: string) => void;
}

export default function RoleSelector({ roles, selectedRole, onChange }: RoleSelectorProps) {
  return (
    <div className={styles.wrapper}>
      <span className={styles.label}>Profile type</span>
      <div className={styles.options}>
        {roles.map((role) => (
          <button
            key={role.id}
            type="button"
            className={
              selectedRole === role.id
                ? `${styles.option} ${styles.optionActive}`
                : styles.option
            }
            onClick={() => onChange(role.id)}
          >
            {role.label}
          </button>
        ))}
      </div>
    </div>
  );
}
