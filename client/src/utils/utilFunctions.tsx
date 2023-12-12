import { ErrorType } from "./interfaces";

interface TimeDifference {
  minutes: number;
  hours: number;
  days: number;
  weeks: number;
  months: number;
  years: number;
}

const isJson = (str: string) => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}
export const formatErrorUrl = (errorObj: ErrorType) => {
    const statusCode = (errorObj.data && errorObj.data.httpStatus) || "Error";
    let errorMessage;

    const isErrObjJson = isJson(errorObj.message);
    if (errorObj.data && errorObj.data.inputValidationError && isErrObjJson){
      const parsedErrorMessage = JSON.parse(errorObj.message)
      errorMessage = parsedErrorMessage[0].message + " Please try again!";
    }else if( typeof errorObj.message === "string"){
      errorMessage = errorObj.message;
    } else{
      errorMessage = "We ran into a problem. Please come back later!";
    }
    return {
        statusCode,
        errorMessage
    }
};

export const calcTimeDifference = (date1: Date, date2: Date): TimeDifference => {
  const diff = Math.floor(date1.getTime() - date2.getTime());

  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30.4167);
  const years = Math.floor(months / 12);

  return {
    minutes,
    hours,
    days,
    weeks,
    months,
    years,
  };
};

export const singularOrPluralMessage = (message: string, num: number) => {
  return num === 1 ? message : `${message}s`;
};

export const getSentTimeMessage = ({ minutes, hours, days, weeks, months, years }: TimeDifference) => {
  if (minutes < 1) {
    return `just now`;
  } else if (hours <= 0) {
    return `${minutes} ${singularOrPluralMessage("minute", minutes)} ago`;
  } else if (days <= 0) {
    return `${hours} ${singularOrPluralMessage("hour", hours)} ago`;
  } else if (weeks <= 0) {
    return `${days} ${singularOrPluralMessage("day", days)} ago`;
  } else if (months <= 0) {
    return `${weeks} ${singularOrPluralMessage("week", weeks)} ago`;
  } else if (years <= 0) {
    return `${months} ${singularOrPluralMessage("month", months)} ago`;
  } else {
    return `${years} ${singularOrPluralMessage("year", years)} ago`;
  }
};
