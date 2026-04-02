"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";
import type { AnalyticsData } from "@/lib/queries/analytics";

const tooltipStyle = {
  backgroundColor: "#161B27",
  border: "1px solid #252D3D",
  borderRadius: "8px",
  color: "#E8EAF0",
  fontSize: "12px",
};

interface Props {
  data: AnalyticsData;
}

export function AnalyticsClient({ data }: Props) {
  const { stats, weekly, treatments, monthly } = data;

  const statCards = [
    {
      label: "Total Patients",
      value: stats.totalPatients,
      change: "All time",
    },
    {
      label: "Appointments This Month",
      value: stats.appointmentsThisMonth,
      change: "Current month",
    },
    {
      label: "Completion Rate",
      value: `${stats.completionRate}%`,
      change: "Current month",
    },
    {
      label: "No-show Rate",
      value: `${stats.noShowRate}%`,
      change: "Current month",
    },
  ];

  return (
    <div className="space-y-5">
      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-border bg-card px-5 py-4"
          >
            <p className="text-xs text-muted-foreground">{stat.label}</p>
            <p className="mt-2 text-2xl font-bold text-foreground">
              {stat.value}
            </p>
            <p className="mt-1 text-xs text-primary">{stat.change}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
        <div className="lg:col-span-3 rounded-xl border border-border bg-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">
            Appointments This Week
          </h3>
          <ResponsiveContainer width="100%" height={330}>
            <BarChart data={weekly} barSize={40}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#252D3D"
                vertical={false}
              />
              <XAxis
                dataKey="day"
                tick={{ fill: "#8892A4", fontSize: 12 }}
                axisLine={true}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#8892A4", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                cursor={{ fill: "rgba(45,212,191,0.06)" }}
              />
              <Bar dataKey="count" fill="#2DD4BF" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">
            Treatment Breakdown
          </h3>
          <ResponsiveContainer width="100%" height={330}>
            <PieChart>
              <Pie
                data={treatments}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={0.5}
                dataKey="value"
              >
                {treatments.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(v) => [`${v}%`, "Share"]}
              />
              <Legend
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: "15px", color: "#8892A4" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4">
          Monthly Appointments Trend
        </h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={monthly}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#252D3D"
              vertical={false}
            />
            <XAxis
              dataKey="month"
              tick={{ fill: "#8892A4", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#8892A4", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              domain={["auto", "auto"]}
            />
            <Tooltip contentStyle={tooltipStyle} />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#2DD4BF"
              strokeWidth={2}
              dot={{ fill: "#2DD4BF", r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
