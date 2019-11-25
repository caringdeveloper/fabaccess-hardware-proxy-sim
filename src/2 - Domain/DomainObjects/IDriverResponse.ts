export default interface IDriverResponse {
  status: number;
  lcdMessage: {
    line1: string;
    line2?: string;
    menu?: string;
  };
}
