import { CategoryIcon } from "../utils/categoryIcons";
import type { Category, EventCategory } from "types";
import styles from "./FormSelect.module.css";

interface FormSelectProps {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLSelectElement>;
  error?: string;
  options: Category[];
  placeholder?: string;
  showCategoryIcons?: boolean;
}

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
}: FormSelectProps) {
  const hasIcon = showCategoryIcons && value;

  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
      <div className={styles.selectWrapper}>
        {hasIcon && (
          <span className={styles.selectIcon} aria-hidden="true">
            <CategoryIcon value={value as EventCategory} size={16} />
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
