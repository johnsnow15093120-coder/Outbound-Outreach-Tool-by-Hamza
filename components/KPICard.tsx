import React from 'react';

interface KPICardProps {
  label: string;
  currentValue: number;
  targetValue: number;
  isPercentage?: boolean;
  isCurrency?: boolean;
  shorterIsBetter?: boolean;
  unit?: string;
}

const ArrowUp: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={`h-3 w-3 ${className}`}><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>
);

const ArrowDown: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={`h-3 w-3 ${className}`}><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 6 12"></polyline></svg>
);

const KPICard: React.FC<KPICardProps> = ({ label, currentValue, targetValue, isPercentage = false, isCurrency = false, shorterIsBetter = false, unit = '' }) => {
  const gap = currentValue - targetValue;
  const isPositive = shorterIsBetter ? gap <= 0 : gap >= 0;

  const formatValue = (value: number, forGap: boolean = false) => {
    const val = forGap ? Math.abs(value) : value;
    if (isCurrency) {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(val);
    }
    if (isPercentage) return `${val.toFixed(2)}%`;
    if (unit) {
        if (forGap) return `${Math.round(val)}`;
        return `${Math.round(val)} ${unit}`;
    }
    return val.toFixed(2);
  };

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 flex flex-col justify-between">
      <div>
        <p className="text-sm font-medium text-gray-400">{label}</p>
        <p className="text-3xl font-bold text-white mt-1">{formatValue(currentValue)}</p>
      </div>
      <div className="flex items-center justify-between mt-4">
        <p className="text-xs text-gray-500">Target: {formatValue(targetValue)}</p>
        <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${isPositive ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
          {gap !== 0 && (isPositive ? <ArrowUp /> : <ArrowDown />)}
          <span>{formatValue(gap, true)}</span>
        </div>
      </div>
    </div>
  );
};

export default KPICard;