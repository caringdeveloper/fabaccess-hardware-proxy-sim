import Driver, { IDriverResponse } from "../Drivers/Driver";
import { inject, injectable } from "inversify";

import { iocContainer as Container } from "../../Modules/ioc-container";
import { ProxyRequest } from "../DomainObjects/ProxyRequest";

export interface IHardwareProxyService {
  LoadDriverAndExecute(request: ProxyRequest): Promise<IDriverResponse | null>;
}

@injectable()
export class HardwareProxyService implements IHardwareProxyService {
  public async LoadDriverAndExecute(
    request: ProxyRequest
  ): Promise<IDriverResponse> {
    /**
     * Hier muss die Kommunikation mit dem Backend der Studierenden
     * stattfinden.
     */

    // TODO: Look up if machine exists and get driver information
    const lookupResult = { DriverClass: "Printer" };

    // Create driver instance if appropriate
    const driverInstance = Container.get<Driver>(
      `I${lookupResult.DriverClass}`
    );

    // Execute driver and wait for response
    return await driverInstance.HandleEvent(request.event, {
      ...request.payload,
      mid: request.mid
    });
  }
}
