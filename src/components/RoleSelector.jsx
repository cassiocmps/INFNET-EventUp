import styles from "./RoleSelector.module.css";

export default function RoleSelector({ roles, selectedRole, onChange }) {
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
