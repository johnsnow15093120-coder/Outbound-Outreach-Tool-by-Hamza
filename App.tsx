import React, { useState, useReducer, createContext } from 'react';
import { AppState, Tool, AppContextType, ProgramSettings, ToolData } from './types';
import { INITIAL_STATE } from './constants';
import Sidebar from './components/Sidebar';
import ToolView from './components/ToolView';
import { exportStyledReport } from './utils/csv';

export const AppContext = createContext<AppContextType | null>(null);

function appReducer(state: AppState, action: any): AppState {
  switch (action.type) {
    case 'UPDATE_FIELD': {
      const { path, value } = action.payload;
      const pathParts = path.split('.');

      // Handle programSettings: path is like "programSettings.offerPrice"
      if (pathParts.length === 2 && pathParts[0] === 'programSettings') {
        const [section, field] = pathParts as [keyof AppState, keyof ProgramSettings];
        
        if (section !== 'programSettings') return state;

        const originalValue = state[section][field];
        
        let processedValue: string | number = value;
        if (typeof originalValue === 'number') {
          processedValue = parseFloat(value) || 0;
          if (processedValue < 0) processedValue = 0;
        }

        return {
          ...state,
          [section]: {
            ...state[section],
            [field]: processedValue,
          },
        };
      }

      // Handle tool data: path is like "LIO.currentPerformance.connectionRequestsSent"
      if (pathParts.length === 3) {
        const [tool, subSection, field] = pathParts as [Tool, keyof ToolData, keyof ToolData[keyof ToolData]];
        
        const toolState = state[tool];
        if (!toolState) return state;

        const subSectionState = toolState[subSection];
        if (!subSectionState) return state;

        const originalValue = subSectionState[field];

        let processedValue: string | number = value;
        if (typeof originalValue === 'number') {
            processedValue = parseFloat(value) || 0;
            if (processedValue < 0) processedValue = 0;
        }
        
        return {
          ...state,
          [tool]: {
            ...state[tool],
            [subSection]: {
              ...state[tool][subSection],
              [field]: processedValue,
            },
          },
        };
      }
      
      return state;
    }
    default:
      return state;
  }
}

const App: React.FC = () => {
  const [state, dispatch] = useReducer(appReducer, INITIAL_STATE);
  const [activeTool, setActiveTool] = useState<Tool>(Tool.LIO);

  const handleExport = () => {
    exportStyledReport(state);
  };

  return (
    <AppContext.Provider value={{ state, dispatch, activeTool, setActiveTool }}>
      <div className="min-h-screen font-sans flex flex-col md:flex-row">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-gray-900 overflow-y-auto">
           <header className="flex justify-between items-center mb-6">
             <div>
                <h1 className="text-2xl font-bold text-white">Strategic Planning Suite</h1>
                <p className="text-gray-400">V6 - Final</p>
             </div>
             <button
              onClick={handleExport}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Export Excel Report (.xlsx)
            </button>
           </header>
          <ToolView />
        </main>
      </div>
    </AppContext.Provider>
  );
};

export default App;