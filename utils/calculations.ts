
import { ProgramSettings, PerformanceData, Tool } from '../types';

export interface CalculatedKPIs {
    requestAcceptanceRate: number;
    positiveReplyRate: number;
    meetingBookingRate: number;
    showUpRate: number;
    closeRate: number;
    salesCycleLength: number;
    currentRevenue: number;
    avgDealValue: number;
}

export function calculateKPIs(settings: ProgramSettings, performance: PerformanceData, tool: Tool): CalculatedKPIs {
    const {
        connectionRequestsSent,
        totalAcceptedRequests,
        messagesSent,
        totalReplies,
        positiveReplies,
        meetingsScheduled,
        totalShows,
        dealsClosed,
        salesCycleLength
    } = performance;

    const currentRevenue = dealsClosed * settings.offerPrice;
    
    let requestAcceptanceRate = 0;
    let positiveReplyRate = 0;

    if (tool === Tool.LIO) {
        requestAcceptanceRate = connectionRequestsSent > 0 ? (totalAcceptedRequests / connectionRequestsSent) * 100 : 0;
        positiveReplyRate = totalAcceptedRequests > 0 ? (positiveReplies / totalAcceptedRequests) * 100 : 0;
    } else { // FIO & EO
        // FIX: The definition of Positive Reply Rate was inconsistent. 
        // It's calculated here against `totalReplies`, but the planning tools (ActionPlan, AIGeneratedPlan)
        // use a definition based on `messagesSent`. This is the correct business metric.
        // Changed denominator from `totalReplies` to `messagesSent` for consistency.
        positiveReplyRate = messagesSent > 0 ? (positiveReplies / messagesSent) * 100 : 0;
    }

    const meetingBookingRate = positiveReplies > 0 ? (meetingsScheduled / positiveReplies) * 100 : 0;
    const showUpRate = meetingsScheduled > 0 ? (totalShows / meetingsScheduled) * 100 : 0;
    const closeRate = totalShows > 0 ? (dealsClosed / totalShows) * 100 : 0;
    const avgDealValue = dealsClosed > 0 ? currentRevenue / dealsClosed : settings.offerPrice;

    return {
        requestAcceptanceRate,
        positiveReplyRate,
        meetingBookingRate,
        showUpRate,
        closeRate,
        salesCycleLength,
        currentRevenue,
        avgDealValue,
    };
}