import styles from "./FormSelect.module.css";

export default function FormSelect({
  id,
  name,
  label,
  value,
  onChange,
  error,
  options,
  placeholder,
}) {
  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
      <select
        id={id}
        className={
          error ? `${styles.select} ${styles.selectError}` : styles.select
        }
        name={name}
        value={value}
        onChange={onChange}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? (
        <span id={`${id}-error`} className={styles.errorText}>
          {error}
        </span>
      ) : null}
    </div>
  );
}
