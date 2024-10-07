import React from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";

// GeoJSON data for Nepal
const geoUrl = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": { "name": "Nepal" },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [80.0588, 30.4469],
            [80.2684, 30.4537],
            [80.4687, 30.3957],
            [80.6498, 30.4059],
            [80.8679, 30.2696],
            [80.9056, 30.0951],
            [80.6535, 29.6024],
            [80.5445, 29.2794],
            [80.4625, 29.2216],
            [80.2824, 28.9348],
            [80.0096, 28.9233],
            [79.6619, 28.7263],
            [79.7025, 28.4695],
            [79.8967, 28.2498],
            [80.1063, 28.1088],
            [80.3328, 28.0783],
            [80.5852, 28.0626],
            [80.8285, 28.1016],
            [81.0914, 28.1473],
            [81.3216, 28.2762],
            [81.2789, 28.3662],
            [81.2585, 28.5263],
            [81.3733, 28.7271],
            [81.5752, 28.7845],
            [81.6537, 28.9666],
            [81.4949, 29.1459],
            [81.1948, 29.3899],
            [81.1789, 29.5754],
            [81.1598, 29.7643],
            [81.0295, 29.8445],
            [80.9641, 30.0719],
            [80.6467, 30.3577],
            [80.4145, 30.5145],
            [80.0588, 30.4469],
          ],
        ],
      },
    },
  ],
};

export default function MapChart() {
  return (
    <div className="w-full flex justify-center">
      <div className="w-11/12 flex justify-center">
        <ComposableMap>
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="#22c55e"
                  stroke="#D6D6DA"
                  onMouseEnter={() => {
                    console.log(geo.properties.name);
                  }}
                  onMouseLeave={() => {
                    // Handle mouse leave if needed
                  }}
                />
              ))
            }
          </Geographies>
        </ComposableMap>
      </div>
    </div>
  );
}
