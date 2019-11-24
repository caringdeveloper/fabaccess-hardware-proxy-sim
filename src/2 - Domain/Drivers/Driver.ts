import { TSMap as Dictionary } from "typescript-map";

export interface IDriverResponse {
  status: number;
  lcdMessage: {
    line1: string;
    line2?: string;
    menu?: string;
  };
}

export type DriverHandler = (payload: any) => Promise<IDriverResponse>;

export default abstract class Driver {
  protected commandMap = new Dictionary<string, DriverHandler>();

  constructor() {
    this.commandMap.set("HEARTBEAT", this.HandleHeartbeat);
    this.commandMap.set("SENSOR_LOST", this.HandleSensorLost);
  }

  protected async HandleHeartbeat(
    payload: any
  ): Promise<IDriverResponse | null> {
    return null;
  }

  protected async HandleSensorLost(
    payload: any
  ): Promise<IDriverResponse | null> {
    return null;
  }

  public async HandleEvent(
    event: string,
    payload: any
  ): Promise<IDriverResponse | null> {
    const driver = this.commandMap.get(event.toUpperCase());
    return await driver(payload);
  }
}
