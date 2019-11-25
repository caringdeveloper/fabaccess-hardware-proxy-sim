import { inject, injectable } from "inversify";

import { iocContainer as Container } from "../../Modules/ioc-container";
import Driver from "../Drivers/Driver";
import IDriverResponse from "../DomainObjects/IDriverResponse";
import { IProxyRequest } from "../DomainObjects/IProxyRequest";
import NotFoundException from "../Exceptions/NotFoundException";

export interface IHardwareProxyService {
  LoadDriverAndExecute(request: IProxyRequest): Promise<IDriverResponse | null>;
}

@injectable()
export class HardwareProxyService implements IHardwareProxyService {
  public async LoadDriverAndExecute(
    request: IProxyRequest
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

    if (!driverInstance)
      throw new NotFoundException(
        `Could not find driver ${lookupResult.DriverClass}`
      );

    try {
      // Execute driver and wait for response
      return await driverInstance.HandleEvent(request.event, {
        ...request.payload,
        mid: request.mid
      });
    } catch (err) {
      throw err;
    }
  }
}
