
import React from 'react';
import type { CalculationResult } from '../types';
import { SummaryCard } from './SummaryCard';
import { ComparisonChart } from './ComparisonChart';

interface ResultsDisplayProps {
  result: CalculationResult | null;
  principal: number;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result, principal }) => {
  return (
    <div className="bg-mojo-dark text-white p-8 md:p-12 lg:p-16">
      <h2 className="text-2xl font-bold text-white mb-4">Your result</h2>
      {result ? (
        <div className="animate-fade-in space-y-8">
          <p className="text-slate-300 text-lg">With your overpayments, you could save a significant amount on interest and become mortgage-free sooner.</p>
          
          <div className="space-y-10 pt-4">
            <SummaryCard 
              value={formatCurrency(result.interestSaved)}
              label="Total interest saved"
            />
            <SummaryCard 
              value={`${result.timeSavedYears} years & ${result.timeSavedMonths} months`}
              label="Time saved on your mortgage"
            />
          </div>
          
          <hr className="border-slate-700 my-8" />

          <div>
             <h3 className="text-xl font-semibold text-white mb-4">Total Amount Paid</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="bg-slate-800/50 p-4 rounded-lg text-center">
                    <p className="text-sm text-slate-400">Original total repayment</p>
                    <p className="text-2xl font-bold text-white">{formatCurrency(result.totalPaidOriginal)}</p>
                </div>
                <div className="bg-slate-800/50 p-4 rounded-lg text-center">
                    <p className="text-sm text-slate-400">New total with overpayments</p>
                    <p className="text-2xl font-bold text-white">{formatCurrency(result.totalPaidNew)}</p>
                </div>
              </div>
            <ComparisonChart 
              principal={principal} 
              originalInterest={result.totalInterestOriginal} 
              newInterest={result.totalInterestNew}
            />
          </div>

        </div>
      ) : (
        <div className="flex flex-col h-full mt-4">
          <p className="text-slate-300 text-lg">Enter your mortgage and overpayment details to see how much you could save.</p>
          <div className="space-y-10 pt-10">
            <SummaryCard 
              value="£0"
              label="Total interest saved"
            />
            <SummaryCard 
              value="0 years & 0 months"
              label="Time saved on your mortgage"
            />
          </div>
        </div>
      )}
    </div>
  );
};