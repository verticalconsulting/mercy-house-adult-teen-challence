import React from 'react';
import { FunnelChart, Funnel, LabelList, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const COLORS = ['#002E54', '#1a4a7a', '#2d6a9f', '#CCA357', '#e8b96a'];

export default function DonationFunnelChart({ data }) {
  if (!data || data.length === 0) return null;

  return (
    <ResponsiveContainer width="100%" height={380}>
      <FunnelChart>
        <Tooltip
          formatter={(value, name) => [value.toLocaleString(), name]}
          contentStyle={{ borderRadius: '8px', fontSize: '14px' }}
        />
        <Funnel dataKey="value" data={data} isAnimationActive>
          {data.map((entry, index) => (
            <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
          ))}
          <LabelList
            position="center"
            fill="#fff"
            stroke="none"
            dataKey="name"
            style={{ fontSize: '13px', fontWeight: 600 }}
          />
        </Funnel>
      </FunnelChart>
    </ResponsiveContainer>
  );
}