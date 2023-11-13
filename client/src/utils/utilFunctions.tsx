import { TRPCClientError } from '@trpc/client'
import type { Routes } from "../../../server/routes";

export const formatErrorUrl = (errorObj: Response | Error | InstanceType<typeof TRPCClientError<Routes>>) => {
    //console.log(JSON.stringify(errorObj, null, 2))

    let statusCode: number | null;
    let errorMessage: string;
    let errorStack: string | null;

    if (errorObj instanceof TRPCClientError) {
        statusCode = errorObj.data.httpStatus || 500;
        errorMessage = errorObj.message || "We ran into a problem. Please come back later!";
        errorStack = errorObj.data?.stack || null
    } else if (errorObj instanceof Response) {
        // Idk if Response.error() throws itself or if it needs to be caught manually
        statusCode = errorObj.status
        errorMessage = errorObj.statusText
        errorStack = null  // idk if Response.error() has a stack
    } else {
        // catch generic error
        errorObj = errorObj as Error

        statusCode = null;
        errorMessage = errorObj.message
        errorStack = errorObj?.stack || null
    }

    return {
        statusCode,
        errorMessage,
        errorStack
    }
};
