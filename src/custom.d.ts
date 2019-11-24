declare namespace Express {
  export interface Request {
    user?: { id: string };
  }
}

declare module "mfi-api";
