import { RouterOutputs } from "./api";

export type Comment = RouterOutputs["getPostAndComments"]["comments"][0];
export type PostAndComments = RouterOutputs["getPostAndComments"];
export type PathArray = number | "comments";

export interface ErrorType {
  message: string;
  data: {
    httpStatus: number;
    inputValidationError: {
      fieldErrors: {
        [key: string]: string[];
      };
    } | null;
  };
}