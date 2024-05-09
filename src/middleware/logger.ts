import { NextFunction, Request, Response } from "express";

export const logRequestDetails = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { url, method, query, body } = req;
  console.info(`[${new Date().toLocaleString()}] Request Details: %o`, {
    url,
    method,
    query,
    body,
  });
  const oldSend = res.send;
  //@ts-ignore
  res.send = function (...args: any[]) {
    console.info("Response: %o", args[0]);
    //@ts-ignore
    oldSend.apply(res, args);
  };

  next();
};
