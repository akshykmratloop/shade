function DashboardStats({
  title,
  icon,
  value,
  description,
  colorIndex,
  opt1,
  opt2,
  opt3,
}) {
  const COLORS = ["primary", "primary"];

  const getDescStyle = () => {
    if (description.includes("↗︎"))
      return "font-bold text-green-700 dark:text-green-300";
    else if (description.includes("↙"))
      return "font-bold text-rose-500 dark:text-red-400";
    else return "";
  };

  return (
    <div className="stats shadow">
      <div className="stat">
        <div
          className={`stat-figure dark:text-slate-300 text-${
            COLORS[colorIndex % 2]
          }`}
        >
          {icon}
        </div>
        <div className="stat-title dark:text-slate-300">{title}</div>
        <div
          className={`stat-value dark:text-slate-300 text-${
            COLORS[colorIndex % 2]
          }`}
        >
          {value}
        </div>
        <div className={"stat-desc  " + getDescStyle()}>{description}</div>
        <div className={"stat-desc  " + getDescStyle()}>{opt1}</div>
        <div className={"stat-desc  " + getDescStyle()}>{opt2}</div>
        <div className={"stat-desc  " + getDescStyle()}>{opt3}</div>
      </div>
    </div>
  );
}

export default DashboardStats;
