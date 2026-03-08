import styles from "./Tabs.module.css";

export default function Tabs({ tabs, activeTab, onChange }) {
  return (
    <div className={styles.tabs}>
      {tabs.map((tab) => (
        <button
          key={tab.key}
          className={`${styles.tab} ${
            activeTab === tab.key ? styles.activeTab : ""
          }`}
          onClick={() => onChange(tab.key)}
          type="button"
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
