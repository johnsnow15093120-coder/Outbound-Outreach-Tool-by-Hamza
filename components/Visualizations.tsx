import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Tool } from '../types';
import { CalculatedKPIs } from '../utils/calculations';

const formatCurrency = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);

export const RevenueGauge: React.FC<{ current: number, target: number }> = ({ current, target }) => {
    const percentage = target > 0 ? Math.min((current / target) * 100, 100) : 0;

    return (
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-md font-bold text-white">Revenue Goal</h3>
                <span className="text-lg font-extrabold text-blue-400">{percentage.toFixed(0)}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2.5 mb-2">
                <div 
                    className="bg-blue-500 h-2.5 rounded-full" 
                    style={{ width: `${percentage}%`, transition: 'width 0.5s ease-out' }}
                ></div>
            </div>
            <p className="text-gray-400 text-sm text-right">
                <span className="font-semibold text-white">{formatCurrency(current)}</span>
                <span className="text-gray-500"> / {formatCurrency(target)}</span>
            </p>
        </div>
    );
};

export const FunnelChart: React.FC<{ kpis: CalculatedKPIs, tool: Tool }> = ({ kpis, tool }) => {
    const funnelData = tool === Tool.LIO ? [
        { name: 'Requests Sent', value: 100 },
        { name: 'Accepted', value: kpis.requestAcceptanceRate },
        { name: 'Positive Replies', value: kpis.requestAcceptanceRate * (kpis.positiveReplyRate / 100) },
        { name: 'Meetings', value: kpis.requestAcceptanceRate * (kpis.positiveReplyRate / 100) * (kpis.meetingBookingRate / 100) },
        { name: 'Shows', value: kpis.requestAcceptanceRate * (kpis.positiveReplyRate / 100) * (kpis.meetingBookingRate / 100) * (kpis.showUpRate / 100) },
        { name: 'Deals', value: kpis.requestAcceptanceRate * (kpis.positiveReplyRate / 100) * (kpis.meetingBookingRate / 100) * (kpis.showUpRate / 100) * (kpis.closeRate / 100) },
    ] : [
        { name: tool === Tool.EO ? 'Emails Sent' : 'Messages Sent', value: 100 },
        { name: 'Positive Replies', value: kpis.positiveReplyRate },
        { name: 'Meetings', value: kpis.positiveReplyRate * (kpis.meetingBookingRate / 100) },
        { name: 'Shows', value: kpis.positiveReplyRate * (kpis.meetingBookingRate / 100) * (kpis.showUpRate / 100) },
        { name: 'Deals', value: kpis.positiveReplyRate * (kpis.meetingBookingRate / 100) * (kpis.showUpRate / 100) * (kpis.closeRate / 100) },
    ];

    const colors = ["#2563eb", "#3b82f6", "#60a5fa", "#93c5fd", "#bfdbfe", "#dbeafe"];

    return (
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 h-96">
            <h3 className="text-lg font-bold text-white mb-4">Funnel Visualization</h3>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={funnelData} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                    <XAxis type="number" hide />
                    <YAxis type="category" dataKey="name" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} width={100} />
                    <Tooltip
                        cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }}
                        contentStyle={{
                            background: '#1f2937',
                            border: '1px solid #4b5563',
                            borderRadius: '0.5rem'
                        }}
                        formatter={(value: number) => [`${value.toFixed(2)}%`, 'Conversion']}
                    />
                    <Bar dataKey="value" barSize={20} animationDuration={500}>
                        {funnelData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};