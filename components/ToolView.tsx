import React, { useContext } from 'react';
import { AppContext } from '../App';
import { AppContextType, Tool, toolDetails } from '../types';
import { calculateKPIs } from '../utils/calculations';
import KPICard from './KPICard';
import { RevenueGauge, FunnelChart } from './Visualizations';
import ActionPlan from './ActionPlan';
import AIGeneratedPlan from './AIGeneratedPlan';

const StyledInput: React.FC<{
    label: string;
    value: string | number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type?: string;
    placeholder?: string;
    isCurrency?: boolean;
}> = ({ label, value, onChange, type = "text", placeholder, isCurrency = false }) => (
    <div>
        <label className="block text-sm font-medium text-gray-400 mb-1">{label}</label>
        <div className="relative">
            {isCurrency && <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">$</span>}
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`w-full bg-gray-800/50 border border-gray-700 rounded-md shadow-sm py-2 ${isCurrency ? 'pl-7 pr-3' : 'px-3'} text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow`}
            />
        </div>
    </div>
);

const ToolView: React.FC = () => {
  const { state, dispatch, activeTool } = useContext(AppContext) as AppContextType;
  const toolData = state[activeTool];
  const kpis = calculateKPIs(state.programSettings, toolData.currentPerformance, activeTool);

  const handleInputChange = (path: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'UPDATE_FIELD', payload: { path, value: e.target.value } });
  };
  
  const renderCurrentPerformanceInputs = () => {
    const commonInputs = [
        { key: 'positiveReplies', label: 'Positive Replies' },
        { key: 'meetingsScheduled', label: 'Meetings Scheduled' },
        { key: 'totalShows', label: 'Total Shows' },
        { key: 'dealsClosed', label: 'Deals Closed' },
        { key: 'salesCycleLength', label: 'Sales Cycle Length (in Days)' },
    ];
    let specificInputs;
    if (activeTool === Tool.LIO) {
      specificInputs = [
        { key: 'connectionRequestsSent', label: 'Connection Requests Sent' },
        { key: 'totalAcceptedRequests', label: 'Total Accepted Requests' },
      ];
    } else {
      const messagesLabel = activeTool === Tool.EO ? 'Emails Sent' : 'Messages Sent';
      specificInputs = [
        { key: 'messagesSent', label: messagesLabel },
        { key: 'totalReplies', label: 'Total Replies' },
      ];
    }
    const allInputs = [...specificInputs, ...commonInputs];

    return allInputs.map(input => (
      <StyledInput
        key={input.key}
        label={input.label}
        type="number"
        value={toolData.currentPerformance[input.key as keyof typeof toolData.currentPerformance]}
        placeholder={`e.g., ${toolData.currentPerformance[input.key as keyof typeof toolData.currentPerformance] || 100}`}
        onChange={handleInputChange(`${activeTool}.currentPerformance.${input.key}`)}
      />
    ));
  }

  const renderReferenceTargetInputs = () => {
    const commonInputs = [
        { key: 'positiveReplyRate', label: 'Target Positive Reply Rate (%)' },
        { key: 'meetingBookingRate', label: 'Target Meeting Booking Rate (%)' },
        { key: 'showUpRate', label: 'Target Show Up Rate (%)' },
        { key: 'closeRate', label: 'Target Close Rate (Deal-to-Show) (%)' },
        { key: 'avgDealValue', label: 'Target Average Deal Value ($)', isCurrency: true },
        { key: 'salesCycleLength', label: 'Target Sales Cycle Length (in Days)' },
    ];
    let specificInputs = [];
    if(activeTool === Tool.LIO) {
      specificInputs.push({ key: 'requestAcceptanceRate', label: 'Target Request Acceptance Rate (%)' });
    }
    const allInputs = [...specificInputs, ...commonInputs];

    return allInputs.map(input => (
      <StyledInput
        key={input.key}
        label={input.label}
        type="number"
        isCurrency={input.isCurrency}
        value={toolData.referenceTargets[input.key as keyof typeof toolData.referenceTargets]}
        placeholder={`e.g., ${toolData.referenceTargets[input.key as keyof typeof toolData.referenceTargets] || 10}`}
        onChange={handleInputChange(`${activeTool}.referenceTargets.${input.key}`)}
      />
    ));
  }

  return (
    <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
             {/* LEFT & MIDDLE COLUMN CONTAINER */}
            <div className="lg:col-span-2 space-y-6">
                 {/* SETTINGS PANEL */}
                 <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
                    <h2 className="text-lg font-bold text-white mb-4">Program/Offer Settings</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <StyledInput label="Offer Name" value={state.programSettings.offerName} onChange={handleInputChange('programSettings.offerName')} placeholder="e.g., Quantum Leap" />
                        <StyledInput label="Offer Price ($)" type="number" isCurrency={true} value={state.programSettings.offerPrice} onChange={handleInputChange('programSettings.offerPrice')} placeholder="e.g., 5000" />
                        <StyledInput label="Target Revenue Goal ($)" type="number" isCurrency={true} value={state.programSettings.targetRevenueGoal} onChange={handleInputChange('programSettings.targetRevenueGoal')} placeholder="e.g., 100000" />
                    </div>
                </div>

                <AIGeneratedPlan />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* CURRENT PERFORMANCE */}
                    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
                        <h2 className="text-lg font-bold text-white mb-4">Current Performance Data</h2>
                        <div className="space-y-4">{renderCurrentPerformanceInputs()}</div>
                    </div>
                     {/* REFERENCE TARGETS */}
                    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
                        <h2 className="text-lg font-bold text-white mb-4">Reference KPI Targets</h2>
                        <div className="space-y-4">{renderReferenceTargetInputs()}</div>
                    </div>
                </div>

                {/* KPI GAP ANALYSIS */}
                <div>
                  <h2 className="text-xl font-bold text-white mb-4">KPI Gap Analysis</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {activeTool === Tool.LIO && <KPICard label="Request Acceptance Rate" currentValue={kpis.requestAcceptanceRate} targetValue={toolData.referenceTargets.requestAcceptanceRate} isPercentage />}
                      <KPICard label="Positive Reply Rate" currentValue={kpis.positiveReplyRate} targetValue={toolData.referenceTargets.positiveReplyRate} isPercentage />
                      <KPICard label="Meeting Booking Rate" currentValue={kpis.meetingBookingRate} targetValue={toolData.referenceTargets.meetingBookingRate} isPercentage />
                      <KPICard label="Show Up Rate" currentValue={kpis.showUpRate} targetValue={toolData.referenceTargets.showUpRate} isPercentage />
                      <KPICard label="Close Rate" currentValue={kpis.closeRate} targetValue={toolData.referenceTargets.closeRate} isPercentage />
                      <KPICard label="Average Deal Value" currentValue={kpis.avgDealValue} targetValue={toolData.referenceTargets.avgDealValue} isCurrency />
                      <KPICard label="Sales Cycle Length" currentValue={kpis.salesCycleLength} targetValue={toolData.referenceTargets.salesCycleLength} unit="days" shorterIsBetter />
                  </div>
                </div>
            </div>
            {/* RIGHT COLUMN */}
            <div className="space-y-6">
                <RevenueGauge current={kpis.currentRevenue} target={state.programSettings.targetRevenueGoal} />
                <FunnelChart kpis={kpis} tool={activeTool} />
                <ActionPlan />
            </div>
        </div>
    </div>
  );
};

export default ToolView;