export interface IProxyRequest {
  mid: number;
  event: string;
  payload?: IPayload;
}

interface IPayload {
  uid?: string;
  selectedIndex?: number;
}
