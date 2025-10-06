import type { Dispatch } from 'react';

export enum Tool {
  LIO = 'LIO',
  FIO = 'FIO',
  EO = 'EO',
}

export const toolDetails: Record<Tool, { name: string; description: string }> = {
  [Tool.LIO]: { name: "LinkedIn Outbound Plan", description: "Plan your LinkedIn outreach strategy." },
  [Tool.FIO]: { name: "Facebook & IG DM Outreach", description: "Plan your Meta platforms outreach." },
  [Tool.EO]: { name: "Email Outreach", description: "Plan your cold email campaigns." },
};

export interface ProgramSettings {
  offerName: string;
  offerPrice: number;
  targetRevenueGoal: number;
}

export interface PerformanceData {
  positiveReplies: number;
  meetingsScheduled: number;
  totalShows: number;
  dealsClosed: number;
  salesCycleLength: number;
  messagesSent: number; // Used for FIO & EO
  totalReplies: number; // Used for FIO & EO
  connectionRequestsSent: number; // Used for LIO
  totalAcceptedRequests: number; // Used for LIO
}

export interface ReferenceTargets {
  positiveReplyRate: number;
  meetingBookingRate: number;
  showUpRate: number;
  closeRate: number;
  avgDealValue: number;
  salesCycleLength: number;
  requestAcceptanceRate: number; // Used for LIO
}

export interface ToolData {
  currentPerformance: PerformanceData;
  referenceTargets: ReferenceTargets;
}

export interface AppState {
  programSettings: ProgramSettings;
  [Tool.LIO]: ToolData;
  [Tool.FIO]: ToolData;
  [Tool.EO]: ToolData;
}

export type AppContextType = {
  state: AppState;
  // Fix: Replaced React.Dispatch with Dispatch and added the corresponding import from 'react' to resolve the namespace error.
  dispatch: Dispatch<any>;
  activeTool: Tool;
  setActiveTool: (tool: Tool) => void;
};
