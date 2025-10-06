import React, { useContext } from 'react';
import { AppContext } from '../App';
import { AppContextType, Tool } from '../types';

const formatNumber = (value: number) => Math.ceil(value).toLocaleString();
const formatCurrency = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);

const ActionPlan: React.FC = () => {
    const { state, activeTool } = useContext(AppContext) as AppContextType;
    const { programSettings } = state;
    const targets = state[activeTool].referenceTargets;

    const dealsNeeded = programSettings.offerPrice > 0 ? programSettings.targetRevenueGoal / programSettings.offerPrice : 0;
    const showsNeeded = targets.closeRate > 0 ? dealsNeeded / (targets.closeRate / 100) : 0;
    const meetingsNeeded = targets.showUpRate > 0 ? showsNeeded / (targets.showUpRate / 100) : 0;
    const positiveRepliesNeeded = targets.meetingBookingRate > 0 ? meetingsNeeded / (targets.meetingBookingRate / 100) : 0;
    
    let connectionsNeeded = 0;
    let finalActionValue = 0;
    
    if (activeTool === Tool.LIO) {
        connectionsNeeded = targets.positiveReplyRate > 0 ? positiveRepliesNeeded / (targets.positiveReplyRate / 100) : 0;
        finalActionValue = targets.requestAcceptanceRate > 0 ? connectionsNeeded / (targets.requestAcceptanceRate / 100) : 0;
    } else {
        finalActionValue = targets.positiveReplyRate > 0 ? positiveRepliesNeeded / (targets.positiveReplyRate / 100) : 0;
    }

    const planItems = [
        { label: 'Deals to Close', value: formatNumber(dealsNeeded) },
        { label: 'Meetings to Attend (Shows)', value: formatNumber(showsNeeded) },
        { label: 'Meetings to Schedule', value: formatNumber(meetingsNeeded) },
        { label: 'Positive Replies to Generate', value: formatNumber(positiveRepliesNeeded) },
    ];
    if (activeTool === Tool.LIO) {
        planItems.push({ label: 'Connections to Accept', value: formatNumber(connectionsNeeded) });
    }

    return (
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-bold text-white mb-2">Final Action Plan</h3>
            <p className="text-sm text-gray-400 mb-4">Your plan to reach <span className="font-bold text-blue-400">{formatCurrency(programSettings.targetRevenueGoal)}</span>.</p>
            <div className="space-y-3">
                {planItems.map(item => (
                    <div key={item.label} className="flex justify-between items-center text-sm">
                        <span className="text-gray-300">{item.label}:</span>
                        <span className="font-bold text-white">{item.value}</span>
                    </div>
                ))}
            </div>
            <div className="mt-6 pt-4 border-t border-gray-700">
                <p className="text-sm uppercase font-semibold text-blue-400">Final Action</p>
                <p className="text-gray-300 text-sm mt-1">{activeTool === Tool.LIO ? 'Connection Requests to Send' : (activeTool === Tool.EO ? 'Emails to Send' : 'Messages to Send')}:</p>
                <p className="text-4xl font-extrabold text-white mt-1">{formatNumber(finalActionValue)}</p>
            </div>
        </div>
    );
};

export default ActionPlan;