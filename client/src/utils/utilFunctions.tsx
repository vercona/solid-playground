import { Location, useNavigate } from "@solidjs/router";
import { ErrorType } from "./interfaces";
import { cookieStorage } from "@solid-primitives/storage";
import { authTokenCookieName, refreshTokenCookieName } from "./constants";

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


export const redirectToAccount = (location: Location<unknown>) => {
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.hash);
  const loginType = searchParams.get("type");
  if(loginType === "signup"){
    navigate("/account?type=signup");
  }
};

export const storeToken = (name: string, token: string, expires: Date, sameSite: "None" | "Lax" | "Strict") => {
  cookieStorage.setItem(
    name,
    token, {
    sameSite,
    expires,
  });
};

export const getJwtExpirationDate = (jwtExpirationDate: number) => {
  return new Date(Number(jwtExpirationDate) * 1000);
}

export const storeTokenFromUrl = (location: Location<unknown>) => {
  const formattedLocationHash = location.hash.replace("#access_token", "access_token");
  const searchParams = new URLSearchParams(formattedLocationHash);
  const accessToken = searchParams.get("access_token") || "";
  const expires = searchParams.get("expires_at");
  const refreshToken = searchParams.get("refresh_token");
  if (accessToken && expires) {
    storeToken(authTokenCookieName, accessToken, getJwtExpirationDate(Number(expires)), "Strict");
  }
  if(refreshToken){
    const refreshExpirationDate = new Date();
    refreshExpirationDate.setDate(refreshExpirationDate.getDate() + 1);
    storeToken(
      refreshTokenCookieName,
      refreshToken,
      refreshExpirationDate,
      "Strict"
    );
  }
  return accessToken;
};

const deleteCookie = async ( name:string, path:string, domain:string ) => {
  if (cookieStorage.getItem(name)) {
    document.cookie =
      name +
      "=" +
      (path ? ";path=" + path : "") +
      (domain ? ";domain=" + domain : "") +
      ";expires=Thu, 01 Jan 1970 00:00:01 GMT";
  }
}

export const getAuthTokenFromCookie = () => {
  const authToken = cookieStorage.getItem(authTokenCookieName);
  if(authToken){
    return authToken;
  }
  return "";
}

export const getRefreshTokenFromCookie = () => {
  const refreshToken = cookieStorage.getItem(refreshTokenCookieName);
  if (refreshToken) {
    return refreshToken;
  }
  return "";
};

export const removeAuthTokenFromCookie = () => {
  const hostname = window.location.hostname;
  deleteCookie(authTokenCookieName, "/", hostname);
  deleteCookie(refreshTokenCookieName, "/", hostname);
};
