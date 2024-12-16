import BarChart from "@/components/Charts/BarChart";
import GradientBarChart from "@/components/Charts/GradientBarLineChart";
import LineChart from "@/components/Charts/LineChart";
import PieChart from "@/components/Charts/PieChart";

const Analytics = () => {
    return (
        <div className="w-full bg-blue-950">
            <BarChart />
            <GradientBarChart />
            <LineChart />
            <PieChart />
        </div>
    );
}

export default Analytics;
