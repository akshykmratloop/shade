import DashboardStats from "./components/DashboardStats";
import AmountStats from "./components/AmountStats";
import PageStats from "./components/PageStats";

import UserGroupIcon from "@heroicons/react/24/outline/UserGroupIcon";
import { UserRoundCog } from "lucide-react";
import { FolderKanban } from "lucide-react";
import { Notebook } from "lucide-react";
import { GitPullRequest } from "lucide-react";
import UsersIcon from "@heroicons/react/24/outline/UsersIcon";
import CircleStackIcon from "@heroicons/react/24/outline/CircleStackIcon";
import CreditCardIcon from "@heroicons/react/24/outline/CreditCardIcon";
import UserChannels from "./components/UserChannels";
import LineChart from "./components/LineChart";
import BarChart from "./components/BarChart";
import DashboardTopBar from "./components/DashboardTopBar";
import { useDispatch } from "react-redux";
import { showNotification } from "../common/headerSlice";
import DoughnutChart from "./components/DoughnutChart";
import { useState } from "react";
import { useEffect } from "react";
import { dashboardInsight } from "../../app/fetch";


function Dashboard() {

  const [data, setData] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await dashboardInsight();
        setData(response.result);
      } catch (error) {
        console.error("Error fetching dashboard insight:", error);
      }
    }
    fetchData();
  }, []);

  // Show a loading state while waiting for data
  if (!data) {
    return <div>Loading data...</div>;
  }

  // Build statsData inside the component based on fetched data
  const statsData = [
    {
      id: 10,
      title: "Total Roles",
      value: data.totalRoles,
      icon: <UserRoundCog className="w-8 h-8" />,
      description: "",
    },
    {
      id: 11,
      title: "Total Users",
      value: data.totalUsers,
      icon: <UserGroupIcon className="w-8 h-8" />,
      description: "",
    },
    {
      id: 12,
      title: "Resource Role",
      value: data.totalResourceRoles?.totalResourceRole,
      icon: <Notebook className="w-8 h-8" />,
      description: "Roles",
      dropdown: [
        { id: 1, name: "Editor", value: data.totalResourceRoles?.editor },
        { id: 2, name: "Verifier", value: data.totalResourceRoles?.verifier },
        { id: 3, name: "Publish", value: data.totalResourceRoles?.publisher },
      ],
    },
    {
      id: 13,
      title: "Total Requests",
      value: data.totalAvailableRequests?.totalRequests,
      icon: <GitPullRequest className="w-8 h-8" />,
      description: "Requests",
      dropdown: [
        { id: 4, name: "Approved", value: data.totalAvailableRequests?.approved },
        { id: 5, name: "Scheduled", value: data.totalAvailableRequests?.scheduled },
        { id: 6, name: "Pending", value: data.totalAvailableRequests?.pending },
        { id: 7, name: "Rejected", value: data.totalAvailableRequests?.rejected },
      ],
    },
    {
      id: 14,
      title: "Total Projects",
      value: data.totalAvailableProjects?.totalProjects, // Static value, adjust if needed
      icon: <FolderKanban className="w-8 h-8" />,
      description: "Projects",
      dropdown: [
        { id: 8, name: "Ongoing Projects", value: data.totalAvailableProjects?.ongoing },
        { id: 9, name: "Completed Projects", value: data.totalAvailableProjects?.completed },
      ],
    },
  ];

  const updateDashboardPeriod = (newRange) => {
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
