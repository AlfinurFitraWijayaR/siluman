"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export interface AdminDashboardChartsProps {
  ageGroups: { name: string; students: number }[];
  administration: { name: string; value: number }[];
}

const COLORS = {
  green: "#172720",
  orange: "#e9a66b",
  grid: "#dedfd6",
  text: "#555555",
  surface: "#f7f6f0",
};

export function AdminDashboardCharts({
  ageGroups,
  administration,
}: AdminDashboardChartsProps) {
  return (
    <section className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
      {/* KU */}
      <div className="bg-white/70 rounded-xl border border-[#dedfd6]/70 p-4">
        <h2 className="text-[13px] font-semibold text-[#171717]">
          Distribusi siswa per kelas usia
        </h2>
        <div className="h-[240px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={ageGroups}
              margin={{ top: 8, right: 8, bottom: 0, left: -16 }}
            >
              <CartesianGrid
                stroke={COLORS.grid}
                strokeDasharray="3 3"
                vertical={false}
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: COLORS.text, fontSize: 11 }}
              />
              <YAxis
                allowDecimals={false}
                axisLine={false}
                tickLine={false}
                tick={{ fill: COLORS.text, fontSize: 11 }}
              />
              <Tooltip
                cursor={{ fill: COLORS.grid, fillOpacity: 0.4 }}
                contentStyle={{
                  background: COLORS.surface,
                  border: `1px solid ${COLORS.grid}`,
                  borderRadius: 8,
                  fontSize: 12,
                }}
              />
              <Bar
                dataKey="students"
                name="Jumlah siswa"
                fill={COLORS.orange}
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ADM */}
      <div className="bg-white/70 rounded-xl border border-[#dedfd6]/70 p-4">
        <h2 className="text-[13px] font-semibold text-[#171717]">
          Distribusi sebaran administrasi
        </h2>
        <div className="h-[240px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={administration}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={2}
                stroke={COLORS.surface}
              >
                {administration.map((entry, index) => (
                  <Cell
                    key={entry.name}
                    fill={index === 0 ? COLORS.green : COLORS.orange}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: COLORS.surface,
                  border: `1px solid ${COLORS.grid}`,
                  borderRadius: 8,
                  fontSize: 12,
                }}
              />
              <Legend
                iconType="circle"
                wrapperStyle={{ fontSize: 12, color: COLORS.text }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}
