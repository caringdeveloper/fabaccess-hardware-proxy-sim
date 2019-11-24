export default interface IHardwareProxyRequest {
  mid: number;
  key: string;
  event: string;
  payload?: any;
}
