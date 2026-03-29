import styles from "./Tabs.module.css";

interface Tab {
  key: string;
  label: string;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (key: string) => void;
}

export default function Tabs({ tabs, activeTab, onChange }: TabsProps) {
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
