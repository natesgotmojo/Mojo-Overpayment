export interface MortgageInputs {
  amount: string;
  term: string;
  rate: string;
  monthlyOverpayment: string;
  lumpSum: string;
}

export interface CalculationResult {
  originalMonthlyPayment: number;
  newMonthlyPayment: number;
  totalInterestOriginal: number;
  totalInterestNew: number;
  interestSaved: number;
  originalTermMonths: number;
  newTermMonths: number;
  timeSavedYears: number;
  timeSavedMonths: number;
  totalPaidOriginal: number;
  totalPaidNew: number;
}