import { Response } from "express";

export interface ErrorDetail {
  code?: string;
  field?: string;
  details?: string;
}

export interface ResponseModel {
  statusCode: number;
  message: string;
  data: any;
  error: ErrorDetail;
}

export const sendResponse = (res: Response, response: ResponseModel) => {
  res.status(response.statusCode).json(response);
};
