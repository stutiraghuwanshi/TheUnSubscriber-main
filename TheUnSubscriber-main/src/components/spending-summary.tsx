"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Cell } from "recharts";
import type { Subscription, Currency } from "@/types";
import { formatCurrency } from "@/lib/utils";

interface SpendingSummaryProps {
  subscriptions: Subscription[];
  currency: Currency;
  exchangeRate: number;
}

export function SpendingSummary({ subscriptions, currency, exchangeRate }: SpendingSummaryProps) {
  const monthlyTotal = subscriptions.reduce((sum, sub) => sum + sub.cost, 0);
  const yearlyTotal = monthlyTotal * 12;

  const chartData = subscriptions
    .map((sub) => ({
      name: sub.name.length > 15 ? `${sub.name.substring(0, 12)}...` : sub.name,
      cost: currency === 'INR' ? sub.cost * exchangeRate : sub.cost,
    }))
    .sort((a, b) => b.cost - a.cost);

  const chartConfig = {
    cost: {
      label: "Cost",
    },
  } satisfies ChartConfig;

  const chartColors = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
  ];

  const currencySymbol = currency === 'USD' ? '$' : '₹';

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle>Monthly Spend</CardTitle>
          <CardDescription>Total cost of all subscriptions per month.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold tracking-tighter text-primary">
            {formatCurrency(monthlyTotal, currency, exchangeRate)}
          </p>
        </CardContent>
      </Card>
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle>Yearly Spend</CardTitle>
          <CardDescription>Projected cost of all subscriptions per year.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold tracking-tighter text-primary">
            {formatCurrency(yearlyTotal, currency, exchangeRate)}
          </p>
        </CardContent>
      </Card>
      <Card className="md:col-span-2 lg:col-span-3">
        <CardHeader>
          <CardTitle>Spending Breakdown</CardTitle>
          <CardDescription>Cost per subscription per month.</CardDescription>
        </CardHeader>
        <CardContent>
          {subscriptions.length > 0 ? (
            <ChartContainer config={chartConfig} className="h-[250px] w-full">
              <ResponsiveContainer>
                <BarChart data={chartData} margin={{ top: 20, right: 20, left: -10, bottom: 5 }}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="name"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${currencySymbol}${value}`}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="dot" />}
                  />
                  <Bar dataKey="cost" radius={4}>
                    {chartData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          ) : (
            <div className="flex h-[250px] items-center justify-center text-muted-foreground">
              <p>Add a subscription to see your spending breakdown.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
