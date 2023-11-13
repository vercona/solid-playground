interface ErrorType {
    message: string;
    data: {
        httpStatus: number
    }
}

export const formatErrorUrl = (errorObj: ErrorType) => {
    const statusCode = errorObj.data.httpStatus || 500;
    const errorMessage =
        errorObj.message || "We ran into a problem. Please come back later!";
    return {
        statusCode,
        errorMessage
    }
};
