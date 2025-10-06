
import { AppState, Tool } from './types';

export const INITIAL_STATE: AppState = {
  programSettings: {
    offerName: 'High-Ticket Coaching',
    offerPrice: 5000,
    targetRevenueGoal: 100000,
  },
  [Tool.LIO]: {
    currentPerformance: {
      connectionRequestsSent: 1000,
      totalAcceptedRequests: 300,
      positiveReplies: 30,
      meetingsScheduled: 15,
      totalShows: 12,
      dealsClosed: 3,
      salesCycleLength: 30,
      messagesSent: 0,
      totalReplies: 0,
    },
    referenceTargets: {
      requestAcceptanceRate: 35.0,
      positiveReplyRate: 15.0,
      meetingBookingRate: 50.0,
      showUpRate: 85.0,
      closeRate: 25.0,
      avgDealValue: 5000,
      salesCycleLength: 25,
    },
  },
  [Tool.FIO]: {
    currentPerformance: {
      messagesSent: 2000,
      totalReplies: 100,
      positiveReplies: 20,
      meetingsScheduled: 10,
      totalShows: 8,
      dealsClosed: 2,
      salesCycleLength: 20,
      connectionRequestsSent: 0,
      totalAcceptedRequests: 0,
    },
    referenceTargets: {
      requestAcceptanceRate: 0,
      positiveReplyRate: 25.0,
      meetingBookingRate: 50.0,
      showUpRate: 90.0,
      closeRate: 30.0,
      avgDealValue: 5000,
      salesCycleLength: 15,
    },
  },
  [Tool.EO]: {
    currentPerformance: {
      messagesSent: 10000,
      totalReplies: 500,
      positiveReplies: 50,
      meetingsScheduled: 25,
      totalShows: 22,
      dealsClosed: 5,
      salesCycleLength: 45,
      connectionRequestsSent: 0,
      totalAcceptedRequests: 0,
    },
    referenceTargets: {
      requestAcceptanceRate: 0,
      positiveReplyRate: 10.0,
      meetingBookingRate: 60.0,
      showUpRate: 80.0,
      closeRate: 20.0,
      avgDealValue: 5000,
      salesCycleLength: 40,
    },
  },
};
