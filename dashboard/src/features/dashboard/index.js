import DashboardStats from "./components/DashboardStats";
import AmountStats from "./components/AmountStats";
import PageStats from "./components/PageStats";

import UserGroupIcon from "@heroicons/react/24/outline/UserGroupIcon";
import {UserRoundCog} from "lucide-react";
import {FolderKanban} from "lucide-react";
import {Notebook} from "lucide-react";
import {GitPullRequest} from "lucide-react";
import UsersIcon from "@heroicons/react/24/outline/UsersIcon";
import CircleStackIcon from "@heroicons/react/24/outline/CircleStackIcon";
import CreditCardIcon from "@heroicons/react/24/outline/CreditCardIcon";
import UserChannels from "./components/UserChannels";
import LineChart from "./components/LineChart";
import BarChart from "./components/BarChart";
import DashboardTopBar from "./components/DashboardTopBar";
import {useDispatch} from "react-redux";
import {showNotification} from "../common/headerSlice";
import DoughnutChart from "./components/DoughnutChart";
import {useState} from "react";

const statsData = [
  {
    id: 10,
    title: "Total Roles",
    value: "30",
    icon: <UserRoundCog className="w-8 h-8" />,
    description: "",
  },
  {
    id: 11,
    title: "Total Users",
    value: "250",
    icon: <UserGroupIcon className="w-8 h-8" />,
    description: "",
  },
  {
    id: 12,
    title: "Resource Role",
    value: "450",
    icon: <Notebook className="w-8 h-8" />,
    description: "Roles",
    dropdown: [
      {id: 1, name: "Editor", value: 100},
      {id: 2, name: "Verfier", value: 200},
      {id: 3, name: "Publish", value: 150},
    ],
  },
  {
    id: 13,
    title: "Total Requests",
    value: "120",
    icon: <GitPullRequest className="w-8 h-8" />,
    description: "Requests",
    dropdown: [
      {id: 4, name: "Approved", value: 100},
      {id: 5, name: "Pending", value: 200},
      {id: 6, name: "Rejected", value: 150},
    ],
  },
  {
    id: 14,
    title: "Total Projects",
    value: "11",
    icon: <FolderKanban className="w-8 h-8" />,
    description: "Projects",
    dropdown: [
      {id: 7, name: "Ongoing Projects", value: 100},
      {id: 8, name: "Completed Projects", value: 200},
    ],
  },
];

function Dashboard() {
  const dispatch = useDispatch();

  const updateDashboardPeriod = (newRange) => {
    // Dashboard range changed, write code to refresh your values
    dispatch(
      showNotification({
        message: `Period updated to ${newRange.startDate} to ${newRange.endDate}`,
        status: 1,
      })
    );
  };

  return (
    <>
      {/** ---------------------- Select Period Content ------------------------- */}
      {/* <DashboardTopBar updateDashboardPeriod={updateDashboardPeriod} /> */}

      {/** ---------------------- Different stats content 1 ------------------------- */}
      <div className="grid lg:grid-cols-4 mt-2 md:grid-cols-2 grid-cols-1 gap-6">
        {statsData.map((d, k) => {
          return <DashboardStats key={d.id} {...d} colorIndex={k} />;
        })}
      </div>

      {/** ---------------------- Different charts ------------------------- */}
      {/* <div className="grid lg:grid-cols-2 mt-4 grid-cols-1 gap-6">
                <LineChart />
                <BarChart />
            </div> */}

      {/** ---------------------- Different stats content 2 ------------------------- */}
      {/* 
      <div className="grid lg:grid-cols-2 mt-10 grid-cols-1 gap-6">
        <AmountStats />
        <PageStats />
      </div> */}

      {/** ---------------------- User source channels table  ------------------------- */}

      {/* <div className="grid lg:grid-cols-2 mt-4 grid-cols-1 gap-6">
        <UserChannels />
        <DoughnutChart />
      </div> */}
    </>
  );
}

export default Dashboard;
