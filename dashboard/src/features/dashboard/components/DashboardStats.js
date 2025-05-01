import {useState} from "react";
import {ChevronDown} from "lucide-react";

function DashboardStats({title, icon, value, description, colorIndex, roles}) {
  const COLORS = ["primary", "primary"];
  const [visible, setVisible] = useState(false);

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
          {value}{" "}
          {roles && roles.length > 0 ? (
            <div
              onMouseEnter={() => setVisible(true)}
              //   onClick={() => setVisible(true)}
              onMouseLeave={() => setVisible(false)}
              className="tooltip tooltip-bottom relative"
              //   data-tip="View Roles"
            >
              <ChevronDown className="w-6 h-6" />
            </div>
          ) : (
            ""
          )}
        </div>
        {/* <div className={"stat-desc  " + getDescStyle()}>{description}</div> */}
      </div>

      {visible && roles && roles.length > 0 ? (
        <div className="absolute right-0 mt-2 w-64 top-[28%] left-[63%] bg-white shadow-lg rounded-xl border border-gray-200 z-10 p-4">
          <div className="text-gray-800 text-sm font-semibold mb-2">Roles</div>
          <div className="h-[2px] bg-slate-200 mb-2"></div>
          <div className="space-y-2">
            {roles.map((r, k) => (
              <div
                key={k}
                className="flex justify-between text-sm text-gray-700"
              >
                <span className="font-medium">{r.name}</span>
                <span className="text-gray-500">{r.value}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default DashboardStats;
