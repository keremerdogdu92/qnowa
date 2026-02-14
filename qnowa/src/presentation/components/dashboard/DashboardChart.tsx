'use client';

import { MonthlyStatsDTO } from '@/infrastructure/actions/report.actions';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';

interface DashboardChartProps {
    data: MonthlyStatsDTO[];
}

export function DashboardChart({ data }: DashboardChartProps) {
    return (
        <div className="h-[300px] w-full bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Aylık Gelir / Gider</h3>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={data}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(value as number)} />
                    <Legend />
                    <Line type="monotone" dataKey="sales" name="Satışlar" stroke="#2563eb" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="expenses" name="Giderler" stroke="#dc2626" />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
