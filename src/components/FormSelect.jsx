import { CategoryIcon } from "../utils/categoryIcons";
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
  showCategoryIcons = false,
}) {
  const hasIcon = showCategoryIcons && value;

  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
      <div className={styles.selectWrapper}>
        {hasIcon && (
          <span className={styles.selectIcon} aria-hidden="true">
            <CategoryIcon value={value} size={16} />
          </span>
        )}
        <select
          id={id}
          className={[
            styles.select,
            error ? styles.selectError : "",
            hasIcon ? styles.selectWithIcon : "",
          ]
            .filter(Boolean)
            .join(" ")}
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
      </div>
      {error ? (
        <span id={`${id}-error`} className={styles.errorText}>
          {error}
        </span>
      ) : null}
    </div>
  );
}
