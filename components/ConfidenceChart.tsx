import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface ConfidenceChartProps {
  score: number;
  color: string;
}

const ConfidenceChart: React.FC<ConfidenceChartProps> = ({ score, color }) => {
  const data = [
    { name: 'Confidence', value: score },
    { name: 'Remaining', value: 100 - score },
  ];

  return (
    <div className="relative w-48 h-24 mx-auto">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="100%"
            startAngle={180}
            endAngle={0}
            innerRadius={60}
            outerRadius={80}
            paddingAngle={0}
            dataKey="value"
            stroke="none"
          >
            <Cell key="cell-0" fill={color} />
            <Cell key="cell-1" fill="#334155" /> 
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-end pb-0">
        <span className="text-2xl font-bold text-white">{score}%</span>
        <span className="text-xs text-gray-400 uppercase tracking-wider">Confidence</span>
      </div>
    </div>
  );
};

export default ConfidenceChart;