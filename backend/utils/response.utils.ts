import { Response } from "express";

export interface ErrorDetail {
  code?: string;
  field?: string;
  details?: string;
}

interface ResponseModel {
  statusCode: number;
  message: string;
  data: any;
  error: ErrorDetail;
}

export const sendResponse = (
  res: Response,
  { statusCode, message, data, error }: ResponseModel
) => {
  res.status(statusCode).json({
    statusCode,
    message,
    data,
    error,
  });
};
