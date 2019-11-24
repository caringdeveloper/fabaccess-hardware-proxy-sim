export default interface IHardwareProxyRequest {
  event: string;
  payload?: IPayloadRequest;
}

interface IPayloadRequest {
  uid?: string;
  selectedIndex?: number;
}
