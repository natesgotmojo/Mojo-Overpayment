
import React, { useState, useCallback, useEffect } from 'react';
import { CalculatorForm } from './components/CalculatorForm';
import { ResultsDisplay } from './components/ResultsDisplay';
import type { MortgageInputs, CalculationResult } from './types';

const MAX_MORTGAGE_YEARS = 100;

/**
 * Accurately simulates a loan amortization schedule to determine total interest and term.
 * @param principalInPennies The starting loan balance in pennies.
 * @param monthlyPaymentInPennies The fixed monthly payment in pennies.
 * @param monthlyRate The monthly interest rate (e.g., annual rate / 12).
 * @returns An object with the total interest paid (in pennies) and the loan term (in months).
 */
const calculateAmortization = (
    principalInPennies: number,
    monthlyPaymentInPennies: number,
    monthlyRate: number
) => {
    if (principalInPennies <= 0) {
        return { totalInterestInPennies: 0, termInMonths: 0 };
    }

    let balance = principalInPennies;
    let totalInterest = 0;
    let months = 0;

    const firstMonthInterest = Math.round(balance * monthlyRate);
    if (monthlyPaymentInPennies <= firstMonthInterest) {
        throw new Error("Monthly payment does not cover interest. The loan will never be repaid.");
    }

    while (balance > 0) {
        months++;
        const interestForMonth = Math.round(balance * monthlyRate);
        totalInterest += interestForMonth;
        
        const balanceWithInterest = balance + interestForMonth;
        
        if (balanceWithInterest <= monthlyPaymentInPennies) {
            // Final payment, loan is cleared.
            balance = 0;
        } else {
            balance = balanceWithInterest - monthlyPaymentInPennies;
        }

        if (months > MAX_MORTGAGE_YEARS * 12) {
            throw new Error(`Calculation exceeded maximum term of ${MAX_MORTGAGE_YEARS} years. Please check your inputs as the overpayment may be too low.`);
        }
    }

    return { totalInterestInPennies: totalInterest, termInMonths: months };
};


/**
 * Orchestrates the mortgage calculation for both original and overpayment scenarios.
 * @param principal The total mortgage amount.
 * @param termYears The original mortgage term in years.
 * @param annualRate The annual interest rate.
 * @param monthlyOverpayment The extra amount paid each month.
 * @param lumpSum A one-off overpayment.
 * @returns A comprehensive result object comparing the two scenarios.
 */
const calculateRepayment = (principal: number, termYears: number, annualRate: number, monthlyOverpayment: number, lumpSum: number) => {
    const monthlyRate = annualRate / 100 / 12;
    const originalTermMonths = termYears * 12;

    const principalInPennies = Math.round(principal * 100);
    const lumpSumInPennies = Math.round(lumpSum * 100);
    const monthlyOverpaymentInPennies = Math.round(monthlyOverpayment * 100);

    // Calculate the standard monthly payment for the original loan using the annuity formula.
    const p = principal;
    const r = monthlyRate;
    const n = originalTermMonths;
    const unroundedPayment = p * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    
    if (!isFinite(unroundedPayment) || unroundedPayment <= 0) {
        throw new Error('Could not calculate monthly payment. Please check your inputs.');
    }
    const originalMonthlyPaymentInPennies = Math.round(unroundedPayment * 100);

    // --- 1. Calculate Original Mortgage Details ---
    const originalLoan = calculateAmortization(
        principalInPennies,
        originalMonthlyPaymentInPennies,
        monthlyRate
    );

    // --- 2. Calculate New Mortgage Details with Overpayments ---
    const newPrincipalInPennies = principalInPennies - lumpSumInPennies;
    const newMonthlyPaymentInPennies = originalMonthlyPaymentInPennies + monthlyOverpaymentInPennies;

    const newLoan = calculateAmortization(
        newPrincipalInPennies,
        newMonthlyPaymentInPennies,
        monthlyRate
    );

    // --- 3. Consolidate results ---
    const totalPaidOriginalInPennies = principalInPennies + originalLoan.totalInterestInPennies;
    const totalPaidNewInPennies = principalInPennies + newLoan.totalInterestInPennies;

    return {
        originalMonthlyPayment: originalMonthlyPaymentInPennies / 100,
        newMonthlyPayment: newMonthlyPaymentInPennies / 100,
        totalInterestOriginal: originalLoan.totalInterestInPennies / 100,
        totalInterestNew: newLoan.totalInterestInPennies / 100,
        originalTermMonths: originalLoan.termInMonths,
        newTermMonths: newLoan.termInMonths,
        totalPaidOriginal: totalPaidOriginalInPennies / 100,
        totalPaidNew: totalPaidNewInPennies / 100,
    };
};

const App: React.FC = () => {
  const [inputs, setInputs] = useState<MortgageInputs>({
    amount: '250000',
    term: '25',
    rate: '3.5',
    monthlyOverpayment: '100',
    lumpSum: '0',
  });
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = useCallback(() => {
    setError(null);
    setResult(null);

    if (!inputs.amount || !inputs.term || !inputs.rate) {
      return;
    }

    const principal = parseFloat(inputs.amount);
    const termYears = parseInt(inputs.term, 10);
    const annualRate = parseFloat(inputs.rate);
    const monthlyOverpayment = parseFloat(inputs.monthlyOverpayment) || 0;
    const lumpSum = parseFloat(inputs.lumpSum) || 0;

    if (isNaN(principal) || principal <= 0 || isNaN(termYears) || termYears <= 0 || isNaN(annualRate) || annualRate < 0) {
      setError('Please enter valid, positive mortgage details.');
      return;
    }
    
    if (lumpSum >= principal) {
        setError('Lump sum cannot be equal to or greater than the mortgage amount.');
        return;
    }

    try {
      const calc = calculateRepayment(principal, termYears, annualRate, monthlyOverpayment, lumpSum);

      const { originalMonthlyPayment, newMonthlyPayment, totalInterestOriginal, totalInterestNew, originalTermMonths, newTermMonths, totalPaidOriginal, totalPaidNew } = calc;

      const timeSavedTotalMonths = originalTermMonths - newTermMonths;
      const timeSavedYears = Math.floor(timeSavedTotalMonths / 12);
      const timeSavedMonths = timeSavedTotalMonths % 12;

      setResult({
        originalMonthlyPayment,
        newMonthlyPayment,
        totalInterestOriginal,
        totalInterestNew,
        interestSaved: totalInterestOriginal - totalInterestNew,
        originalTermMonths,
        newTermMonths,
        timeSavedYears,
        timeSavedMonths,
        totalPaidOriginal,
        totalPaidNew,
      });
    } catch (e) {
      const message = e instanceof Error ? e.message : 'An error occurred during calculation.';
      setError(message);
      console.error(e);
    }
  }, [inputs]);

  useEffect(() => {
    handleCalculate();
  }, [handleCalculate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-6xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <CalculatorForm inputs={inputs} setInputs={setInputs} error={error} />
          <ResultsDisplay result={result} principal={parseFloat(inputs.amount) || 0} />
        </div>
      </div>
    </div>
  );
};

export default App;
