// components/DataChart.tsx
"use client";

interface DataChartProps {
  data: {
    data_values: Record<string, number | string>;
    find_type: string;
  };
}

export default function DataChart({ data }: DataChartProps) {
  // Safety Check
  if (!data || !data.data_values) {
    return <div className="text-red-500">Error: No chart data available.</div>;
  }

  const { data_values, find_type } = data;

  // Convert data to numbers safely
  const chartItems = Object.entries(data_values).map(([label, value]) => {
    const numValue = Number(value);
    return {
      label,
      value: isNaN(numValue) ? 0 : numValue,
    };
  });

  const maxValue = Math.max(...chartItems.map((item) => item.value));

  return (
    <div className="flex flex-col items-center w-full">
      <p className="font-semibold mb-8 text-xl">
        Q: Find the{" "}
        <span className="text-blue-700 font-bold uppercase text-2xl">
          {find_type}
        </span>{" "}
        value
      </p>

      {/* CHART CONTAINER */}
      <div className="flex justify-center gap-6 h-64 w-full max-w-md border-b-4 border-gray-300 pb-2 px-8">
        {chartItems.map((item) => {
          const heightPercentage = maxValue > 0 ? (item.value / maxValue) * 100 : 0;

          return (
            <div
              key={item.label}
              // h-full and justify-end ensure the bar starts from the bottom line
              className="h-full flex flex-col items-center justify-end gap-2 group w-16 relative"
            >
             
              {/* The Bar */}
              <div
                style={{ height: `${heightPercentage}%` }}
                className="w-full rounded-t-lg transition-all duration-500 ease-out bg-green-300 hover:opacity-90 min-h-[4px]"
              ></div>

              {/* Label */}
              <span className="font-bold text-lg text-gray-700">
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}