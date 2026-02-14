import styles from "./FormTextArea.module.css";

export default function FormTextArea({
  id,
  name,
  label,
  value,
  placeholder,
  onChange,
  error,
  rows = 5,
}) {
  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
      <textarea
        id={id}
        className={
          error ? `${styles.textarea} ${styles.textareaError}` : styles.textarea
        }
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        rows={rows}
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
