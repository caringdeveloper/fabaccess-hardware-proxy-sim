import * as express from "express";
import * as shortid from "shortid";

interface IRequest extends express.Request {
  user?: any;
}

const getLevelForStatusCode = (statusCode: number): string => {
  if (statusCode >= 500) { // Internal server errors are logged as errors
    return "error";
  }

  if (statusCode >= 400) { // user errors are logged as warnings
    return "warn";
  }

  return "info";
};

export default (
  req: IRequest,
  res: express.Response,
  next: express.NextFunction,
) => {
  // Making the request unique
  (req as any).requestId = shortid.generate();

  const log = (level: string, ...args: any[]) => {
    (console as any)[level](
      new Date().toISOString(),
      `[${(req as any).requestId}]`,
      level,
      ...args,
    );
  };

  log("info", req.method, req.originalUrl, req.user && req.user.id ? `User: ${req.user.id} Scope: ${req.user.scope}` : "");

  const handleResponseFinished = () => {
    cleanup();
    const level = getLevelForStatusCode(res.statusCode);
    log(level, res.statusCode, res.statusMessage, `${res.get("Content-Length") || 0}b sent`, res.statusCode && res.statusCode === 401 ? `Required Scopes were: ${(req as any)["scopes"]} IP:${req.ip}` : "");
  };

  const handleResponseAborted = () => {
    cleanup();
    log("warn", "Request was aborted");
  };

  const handleInternalError = (err: Error) => {
    cleanup();
    log("error", "Request pipeline error: ", err);
  };

  const cleanup = () => {
    res.removeListener("finish", handleResponseFinished);
    res.removeListener("close", handleResponseAborted);
    res.removeListener("error", handleInternalError);
  };

  res.on("finish", handleResponseFinished);
  res.on("close", handleResponseAborted);
  res.on("error", handleInternalError);

  next();
};
