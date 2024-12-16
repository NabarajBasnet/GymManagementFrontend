import BarChart from "@/components/Charts/BarChart";
import CustomGaugeChart from "@/components/Charts/GaugeChart";
import GradientBarLineChart from "@/components/Charts/GradientBarLineChart";
import LineChart from "@/components/Charts/LineChart";
import PieChart from "@/components/Charts/PieChart";

const Analytics = () => {
    return (
        <div className="w-full bg-blue-950">
            <CustomGaugeChart />
            <BarChart />
            <GradientBarLineChart />
            <LineChart />
            <PieChart />
        </div>
    );
}

export default Analytics;
