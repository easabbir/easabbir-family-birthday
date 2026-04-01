import { differenceInYears, differenceInMonths, differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds, addYears, addMonths, addDays, addHours, addMinutes } from 'date-fns';

export interface AgeBreakdown {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const getExactAge = (dob: Date, now: Date): AgeBreakdown => {
  const years = differenceInYears(now, dob);
  let remainingDate = addYears(dob, years);

  const months = differenceInMonths(now, remainingDate);
  remainingDate = addMonths(remainingDate, months);

  const days = differenceInDays(now, remainingDate);
  remainingDate = addDays(remainingDate, days);

  const hours = differenceInHours(now, remainingDate);
  remainingDate = addHours(remainingDate, hours);

  const minutes = differenceInMinutes(now, remainingDate);
  remainingDate = addMinutes(remainingDate, minutes);

  const seconds = differenceInSeconds(now, remainingDate);

  return { years, months, days, hours, minutes, seconds };
};

export const getYearProgress = (dob: Date, now: Date): number => {
  const years = differenceInYears(now, dob);
  const lastBirthday = addYears(dob, years);
  const nextBirthday = addYears(dob, years + 1);

  const totalCurrentYearMs = nextBirthday.getTime() - lastBirthday.getTime();
  const elapsedCurrentYearMs = now.getTime() - lastBirthday.getTime();

  return (elapsedCurrentYearMs / totalCurrentYearMs) * 100;
};

export const getDaysToNextBirthday = (dob: Date, now: Date): number => {
  const years = differenceInYears(now, dob);
  const nextBirthday = addYears(dob, years + 1);
  return differenceInDays(nextBirthday, now);
};
