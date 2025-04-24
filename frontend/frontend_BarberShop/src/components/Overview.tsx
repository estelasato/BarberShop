"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

const data = [
  {
    name: "Jan",
    total: 1200,
  },
  {
    name: "Fev",
    total: 1900,
  },
  {
    name: "Mar",
    total: 2300,
  },
  {
    name: "Abr",
    total: 2800,
  },
  {
    name: "Mai",
    total: 3500,
  },
  {
    name: "Jun",
    total: 4200,
  },
  {
    name: "Jul",
    total: 4800,
  },
  {
    name: "Ago",
    total: 5200,
  },
  {
    name: "Set",
    total: 5800,
  },
  {
    name: "Out",
    total: 6300,
  },
  {
    name: "Nov",
    total: 6450,
  },
  {
    name: "Dez",
    total: 6200,
  },
]

export function Overview() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `R$${value}`}
        />
        <Bar dataKey="total" fill="currentColor" radius={[4, 4, 0, 0]} className="fill-primary" />
      </BarChart>
    </ResponsiveContainer>
  )
}
