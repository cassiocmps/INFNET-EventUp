import styles from "./FormInput.module.css";

export default function FormInput({
  id,
  name,
  label,
  type,
  value,
  placeholder,
  onChange,
  error,
  autoComplete,
  disabled,
}) {
  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        className={
          error ? `${styles.input} ${styles.inputError}` : styles.input
        }
        name={name}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        autoComplete={autoComplete}
        disabled={disabled}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      {error ? (
        <span id={`${id}-error`} className={styles.errorText}>
          {error}
        </span>
      ) : null}
    </div>
  );
}
