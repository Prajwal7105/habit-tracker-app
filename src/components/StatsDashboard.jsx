import { useMemo } from 'react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from 'recharts'
import { listDaysOfMonth, todayKey } from '../utils/dates'
import { computeDayProgress, computeStreak } from '../utils/progress'

const CHART_COLORS = {
  light: {
    grid: '#dcefe1',
    tick: '#5fab7c',
    bar: '#3f8f5f',
    line: '#2f724a',
    average: '#8fc8a3',
    averageLabel: '#5fab7c',
    tooltipBg: '#ffffff',
    tooltipBorder: '#bbdfc6',
    tooltipText: '#1d3e2b',
  },
  dark: {
    grid: '#334155',
    tick: '#94a3b8',
    bar: '#5fab7c',
    line: '#8fc8a3',
    average: '#5fab7c',
    averageLabel: '#bbdfc6',
    tooltipBg: '#1e293b',
    tooltipBorder: '#475569',
    tooltipText: '#f1f9f3',
  },
}

export default function StatsDashboard({ habits, logs, year, month, theme }) {
  const today = todayKey()
  const days = listDaysOfMonth(year, month)
  const colors = CHART_COLORS[theme === 'dark' ? 'dark' : 'light']

  const chartData = useMemo(() => {
    return days
      .filter(({ key }) => key <= today)
      .map(({ date, key }) => ({
        day: date.getDate(),
        progress: computeDayProgress(habits, logs[key]),
      }))
  }, [days, habits, logs, today])

  const average = chartData.length
    ? Math.round(chartData.reduce((sum, d) => sum + d.progress, 0) / chartData.length)
    : 0

  const streak = useMemo(() => computeStreak(habits, logs, today), [habits, logs, today])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Monthly Average" value={`${average}%`} hint="across tracked days this month" />
        <StatCard
          label="Current Streak"
          value={`${streak} ${streak === 1 ? 'day' : 'days'}`}
          hint="consecutive 100% days"
          highlight
        />
        <StatCard label="Habits Tracked" value={habits.length} hint="active habits" />
      </div>

      <div className="bg-white rounded-xl border border-leaf-200 shadow-sm p-4 sm:p-6 dark:bg-slate-800 dark:border-slate-700">
        <h3 className="text-sm font-semibold text-leaf-700 mb-4 dark:text-leaf-200">Daily Progress %</h3>
        {chartData.length === 0 ? (
          <EmptyChartState />
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: colors.tick }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: colors.tick }} />
              <Tooltip
                formatter={value => [`${value}%`, 'Progress']}
                labelFormatter={label => `Day ${label}`}
                contentStyle={{
                  borderRadius: 8,
                  borderColor: colors.tooltipBorder,
                  backgroundColor: colors.tooltipBg,
                  color: colors.tooltipText,
                }}
              />
              <Bar dataKey="progress" fill={colors.bar} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="bg-white rounded-xl border border-leaf-200 shadow-sm p-4 sm:p-6 dark:bg-slate-800 dark:border-slate-700">
        <h3 className="text-sm font-semibold text-leaf-700 mb-4 dark:text-leaf-200">Monthly Trend</h3>
        {chartData.length === 0 ? (
          <EmptyChartState />
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: colors.tick }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: colors.tick }} />
              <Tooltip
                formatter={value => [`${value}%`, 'Progress']}
                labelFormatter={label => `Day ${label}`}
                contentStyle={{
                  borderRadius: 8,
                  borderColor: colors.tooltipBorder,
                  backgroundColor: colors.tooltipBg,
                  color: colors.tooltipText,
                }}
              />
              <Line type="monotone" dataKey="progress" stroke={colors.line} strokeWidth={2} dot={{ r: 3 }} />
              <ReferenceLine
                y={average}
                stroke={colors.average}
                strokeDasharray="6 4"
                label={{ value: `Avg ${average}%`, position: 'right', fill: colors.averageLabel, fontSize: 12 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}

function StatCard({ label, value, hint, highlight }) {
  return (
    <div
      className={`rounded-xl border p-4 ${
        highlight
          ? 'bg-leaf-600 border-leaf-600 text-white dark:bg-leaf-700 dark:border-leaf-700'
          : 'bg-white border-leaf-200 text-leaf-800 dark:bg-slate-800 dark:border-slate-700 dark:text-leaf-100'
      }`}
    >
      <p
        className={`text-xs font-medium uppercase tracking-wide ${
          highlight ? 'text-leaf-100' : 'text-leaf-500 dark:text-leaf-400'
        }`}
      >
        {label}
      </p>
      <p className="text-2xl font-semibold mt-1">{value}</p>
      <p className={`text-xs mt-1 ${highlight ? 'text-leaf-100' : 'text-leaf-400 dark:text-leaf-500'}`}>{hint}</p>
    </div>
  )
}

function EmptyChartState() {
  return (
    <div className="h-[260px] grid place-items-center text-sm text-leaf-400 dark:text-leaf-500">
      No data yet for this period.
    </div>
  )
}
