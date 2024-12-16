const CustomPieChart = () => {

    const data = [
        { label: "Red", value: 30, color: 'red-500' },
        { label: "Blue", value: 20, color: 'blue-500' },
        { label: "Green", value: 50, color: 'green-500' },
    ];

    const total = data.reduce((sum, item) => sum + item.value, 0); // Total of all data values
    let cumulativeAngle = 0; // Tracks the starting angle of each segment

    return (
        <div className="w-full flex justify-center">
            <svg className="w-8/12" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                {data.map((item, index) => {
                    const angle = (item.value / total) * 360; // Calculate the angle for this slice
                    const largeArc = angle > 180 ? 1 : 0; // Use large-arc-flag for angles > 180 degrees

                    // Coordinates for the arc
                    const x1 = 16 + 16 * Math.cos((Math.PI * cumulativeAngle) / 180);
                    const y1 = 16 + 16 * Math.sin((Math.PI * cumulativeAngle) / 180);
                    cumulativeAngle += angle; // Move to the next angle
                    const x2 = 16 + 16 * Math.cos((Math.PI * cumulativeAngle) / 180);
                    const y2 = 16 + 16 * Math.sin((Math.PI * cumulativeAngle) / 180);

                    // Path for each slice
                    const d = `M 16 16 L ${x1} ${y1} A 16 16 0 ${largeArc} 1 ${x2} ${y2} Z`;

                    return (
                        <path
                            key={index}
                            d={d}
                            className={`fill-${item.color} transition-transform duration-500 hover:scale-105`}
                        />
                    );
                })}
            </svg>
        </div>
    );
};

export default CustomPieChart;
