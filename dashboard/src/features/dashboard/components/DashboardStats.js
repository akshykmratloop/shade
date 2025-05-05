import {useState} from "react";
import {ChevronDown} from "lucide-react";

function DashboardStats({
  title,
  icon,
  value,
  description,
  colorIndex,
  dropdown,
}) {
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
    <div className=" relative rounded-2xl shadow">
      <div className="stat">
        <div
          className={`stat-figure text-[#25439B] dark:text-slate-300 text-${
            COLORS[colorIndex % 2]
          }`}
        >
          {icon}
        </div>
        <div className="stat-title  dark:text-slate-300">{title}</div>
        <div
          className={`stat-value text-[#25439B] dark:text-slate-300 text-${
            COLORS[colorIndex % 2]
          }`}
        >
          {value}{" "}
          {dropdown && dropdown.length > 0 ? (
            <div
              onMouseEnter={() => setVisible(true)}
              onMouseLeave={() => setVisible(false)}
              className="inline-block relative"
            >
              <ChevronDown className="w-6 h-6" />
            </div>
          ) : null}
        </div>
      </div>

      {visible && (
        <div className="absolute top-[85%] z-50 right-0 mt-2 w-64 bg-white shadow-lg rounded-xl border border-gray-200 p-4 dark:bg-[#242933] dark:border-slate-800">
          {/* <div className="h-[2px] bg-slate-200 mb-2">{description}</div> */}
          <div className="space-y-2">
            {dropdown.map((r) => (
              <div
                key={r.id}
                className="flex justify-between text-sm text-gray-700 dark:bg-[#242933] dark:text-slate-300"
              >
                <span
                  className={
                    r.name === "Approved" || r.name === "Completed Projects"
                      ? "text-green-600 font-medium bg-green-200 px-2 py-1 rounded-full"
                      : r.name === "Pending" || r.name === "Ongoing Projects"
                      ? "text-yellow-600 font-medium bg-yellow-200  px-2 py-1 rounded-full"
                      : r.name === "Rejected"
                      ? "text-red-600 font-medium bg-red-200  px-2 py-1 rounded-full"
                      : "text-gray-500"
                  }
                >
                  {r.name}
                </span>
                <span className="text-gray-500">{r.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default DashboardStats;
