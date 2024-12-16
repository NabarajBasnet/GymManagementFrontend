
const CustomLineChart = () => {
    const data = [
        { label: "Jan", value: 200 },
        { label: "Feb", value: 300 },
        { label: "Mar", value: 250 },
        { label: "Apr", value: 400 },
        { label: "May", value: 350 },
        { label: "June", value: 450 },
        { label: "July", value: 300 },
        { label: "Sep", value: 400 },
        { label: "Oct", value: 420 },
        { label: "Nov", value: 520 },
        { label: "Dec", value: 540 },
    ];

    const points = data
        .map((point, index) => `${50 + index * 80},${400 - point.value}`)
        .join(" ");

    return (
        <div className="w-full flex justify-center items-center min-h-screen">
            <svg className="w-full" viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg">
                {/* Line connecting the points */}
                <polyline
                    points={points}
                    className="stroke-blue-500 fill-transparent stroke-2"
                />
                {/* Circles on data points */}
                {data.map((point, index) => (
                    <circle
                        key={index}
                        cx={50 + index * 80}
                        cy={400 - point.value}
                        r="3"
                        className="fill-blue-500 hover:fill-red-500 transition-colors"
                    />
                ))}
            </svg>
        </div>
    );
};

export default CustomLineChart;
