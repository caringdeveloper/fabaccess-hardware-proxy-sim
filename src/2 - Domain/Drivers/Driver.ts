import { TSMap as Dictionary } from "typescript-map";
import IDriverResponse from "../DomainObjects/IDriverResponse";
import NotFoundException from "../Exceptions/NotFoundException";
import { Utils } from "../Utils/Utils";
import { injectable } from "inversify";

export type DriverHandler = (payload: any) => Promise<IDriverResponse>;

@injectable()
export default abstract class Driver {
  protected commandMap = new Dictionary<string, DriverHandler>();

  constructor() {
    this.commandMap.set("HEARTBEAT", this.HandleHeartbeat);
    this.commandMap.set("SENSOR_LOST", this.HandleSensorLost);
  }

  protected async HandleHeartbeat(
    payload: any
  ): Promise<IDriverResponse | null> {
    return Utils.GenerateEmptyReturn();
  }

  protected async HandleSensorLost(
    payload: any
  ): Promise<IDriverResponse | null> {
    // This event occurs whenever the general module registeres that the
    // connected sensor / config module was detached from the general module
    return Utils.GenerateEmptyReturn();
  }

  public async HandleEvent(
    event: string,
    payload: any
  ): Promise<IDriverResponse | null> {
    const commandHandler = this.commandMap.get(event.toUpperCase());

    if (!commandHandler)
      throw new NotFoundException(
        `Command ${event} was not found by the server`
      );

    return await commandHandler(payload);
  }
}
