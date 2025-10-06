import React, { useState, useContext } from 'react';
import { AppContext } from '../App';
import { AppContextType, Tool } from '../types';

const formatNumber = (value: number) => {
    if (value < 1 && value > 0) return value.toFixed(2);
    if (value === 0) return 0;
    return Math.round(value).toLocaleString();
};

const formatCurrency = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(Math.round(value));

const StyledInput: React.FC<{
    label: string;
    value: string | number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type?: string;
    placeholder?: string;
}> = ({ label, value, onChange, type = "text", placeholder }) => (
    <div>
        <label className="block text-sm font-medium text-gray-400 mb-1">{label}</label>
        <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`w-full bg-gray-800/50 border border-gray-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow`}
        />
    </div>
);

const AIGeneratedPlan: React.FC = () => {
    const { state, activeTool } = useContext(AppContext) as AppContextType;
    const [targetOutreach, setTargetOutreach] = useState(1000);

    const { programSettings } = state;
    const targets = state[activeTool].referenceTargets;

    // Perform calculations
    const projectedMetrics: { label: string; value: number; isCurrency?: boolean }[] = [];

    if (activeTool === Tool.LIO) {
        const accepted = targetOutreach * (targets.requestAcceptanceRate / 100);
        const positiveReplies = accepted * (targets.positiveReplyRate / 100);
        const meetings = positiveReplies * (targets.meetingBookingRate / 100);
        const shows = meetings * (targets.showUpRate / 100);
        const deals = shows * (targets.closeRate / 100);
        const revenue = deals * programSettings.offerPrice;
        
        projectedMetrics.push({ label: 'Accepted Requests', value: accepted });
        projectedMetrics.push({ label: 'Positive Replies', value: positiveReplies });
        projectedMetrics.push({ label: 'Meetings Scheduled', value: meetings });
        projectedMetrics.push({ label: 'Shows', value: shows });
        projectedMetrics.push({ label: 'Deals Closed', value: deals });
        projectedMetrics.push({ label: 'Projected Revenue', value: revenue, isCurrency: true });

    } else { // FIO & EO
        const positiveReplies = targetOutreach * (targets.positiveReplyRate / 100);
        const meetings = positiveReplies * (targets.meetingBookingRate / 100);
        const shows = meetings * (targets.showUpRate / 100);
        const deals = shows * (targets.closeRate / 100);
        const revenue = deals * programSettings.offerPrice;

        projectedMetrics.push({ label: 'Positive Replies', value: positiveReplies });
        projectedMetrics.push({ label: 'Meetings Scheduled', value: meetings });
        projectedMetrics.push({ label: 'Shows', value: shows });
        projectedMetrics.push({ label: 'Deals Closed', value: deals });
        projectedMetrics.push({ label: 'Projected Revenue', value: revenue, isCurrency: true });
    }

    const inputLabel = activeTool === Tool.LIO
        ? 'Target Connection Requests'
        : activeTool === Tool.EO
        ? 'Target Emails to Send'
        : 'Target Messages to Send';

    return (
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
            <h2 className="text-lg font-bold text-white mb-2">Custom Outreach Plan</h2>
            <p className="text-sm text-gray-400 mb-4">Enter a target for your initial outreach to project your funnel results based on your KPI targets.</p>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                <div className="lg:col-span-1">
                    <StyledInput
                        label={inputLabel}
                        type="number"
                        value={targetOutreach}
                        onChange={(e) => setTargetOutreach(parseInt(e.target.value, 10) || 0)}
                        placeholder="e.g., 1000"
                    />
                </div>
                <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {projectedMetrics.map(({ label, value, isCurrency }) => (
                        <div key={label} className="bg-gray-900/50 p-4 rounded-lg">
                            <p className="text-sm text-gray-400">{label}</p>
                            <p className="text-2xl font-bold text-white mt-1">
                                {isCurrency ? formatCurrency(value) : formatNumber(value)}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AIGeneratedPlan;