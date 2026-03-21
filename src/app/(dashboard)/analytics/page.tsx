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

const stats = [
  { label: "Total Patients", value: 124, change: "+3 this month" },
  { label: "Appointments This Month", value: 80, change: "+7% vs last month" },
  { label: "Completion Rate", value: "87%", change: "+2% vs last month" },
  { label: "No-show Rate", value: "5%", change: "-1% vs last month" },
];

const weeklyAppointments = [
  { day: "Mon", count: 12 },
  { day: "Tue", count: 18 },
  { day: "Wed", count: 15 },
  { day: "Thu", count: 20 },
  { day: "Fri", count: 14 },
  { day: "Sat", count: 8 },
];

const treatmentBreakdown = [
  { name: "Cleaning", value: 35, fill: "#2DD4BF" },
  { name: "Fillings", value: 25, fill: "#818CF8" },
  { name: "Extractions", value: 15, fill: "#FB923C" },
  { name: "Root Canal", value: 10, fill: "#F472B6" },
  { name: "Other", value: 15, fill: "#4ADE80" },
];

const monthlyTrend = [
  { month: "Aug", count: 58 },
  { month: "Sep", count: 65 },
  { month: "Oct", count: 70 },
  { month: "Nov", count: 62 },
  { month: "Dec", count: 55 },
  { month: "Jan", count: 72 },
  { month: "Feb", count: 75 },
  { month: "Mar", count: 80 },
];

const tooltipStyle = {
  backgroundColor: "#161B27",
  border: "1px solid #252D3D",
  borderRadius: "8px",
  color: "#E8EAF0",
  fontSize: "12px",
};

export default function AnalyticsPage() {
  return (
    <div className="space-y-5">
      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
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

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
        {/* Bar chart – spans 3 */}
        <div className="lg:col-span-3 rounded-xl border border-border bg-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">
            Appointments This Week
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={weeklyAppointments} barSize={28}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#252D3D"
                vertical={false}
              />
              <XAxis
                dataKey="day"
                tick={{ fill: "#8892A4", fontSize: 12 }}
                axisLine={false}
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

        {/* Donut chart – spans 2 */}
        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">
            Treatment Breakdown
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={treatmentBreakdown}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={3}
                dataKey="value"
              >
                {treatmentBreakdown.map((entry, i) => (
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
                wrapperStyle={{ fontSize: "11px", color: "#8892A4" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Line chart */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4">
          Monthly Appointments Trend
        </h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={monthlyTrend}>
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
