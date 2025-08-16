import { Response } from "express";

export interface ResponseModel {
  statusCode: number;
  message: string;
  showMessage: boolean;
  data: any;
}

export const sendResponse = (res: Response, response: ResponseModel) => {
  return res.status(response.statusCode).json(response);
};
