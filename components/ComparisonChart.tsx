
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ComparisonChartProps {
  principal: number;
  originalInterest: number;
  newInterest: number;
}

export const ComparisonChart: React.FC<ComparisonChartProps> = ({ principal, originalInterest, newInterest }) => {
  const data = [
    {
      name: 'Original',
      'Total Interest': Math.round(originalInterest),
      'Principal': Math.round(principal),
    },
    {
      name: 'With Overpayments',
      'Total Interest': Math.round(newInterest),
      'Principal': Math.round(principal),
    },
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  }

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 20,
            left: 30,
            bottom: 5,
          }}
        >
          <CartesianGrid stroke="rgba(255, 255, 255, 0.1)" vertical={false} />
          <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} />
          <YAxis tickFormatter={value => `£${Number(value) / 1000}k`} tick={{ fill: '#94a3b8', fontSize: 12 }} />
          <Tooltip 
            formatter={(value: number) => formatCurrency(value)}
            cursor={{fill: 'rgba(255, 255, 255, 0.1)'}}
            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '0.5rem' }}
            labelStyle={{ color: '#f1f5f9' }}
          />
          <Legend wrapperStyle={{fontSize: "14px", color: '#cbd5e1'}}/>
          <Bar dataKey="Principal" stackId="a" fill="#64748b" name="Principal Paid" />
          <Bar dataKey="Total Interest" stackId="a" fill="#335DFF" name="Interest Paid" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};