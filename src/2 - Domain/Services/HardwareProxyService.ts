import { inject, injectable } from "inversify";

import { iocContainer as Container } from "../../Modules/ioc-container";
import Driver from "../Drivers/Driver";
import IDriverResponse from "../DomainObjects/IDriverResponse";
import { IProxyRequest } from "../DomainObjects/IProxyRequest";
import NotFoundException from "../Exceptions/NotFoundException";
import { IMachineService } from "./MachineService";

export interface IHardwareProxyService {
  LoadDriverAndExecute(request: IProxyRequest): Promise<IDriverResponse | null>;
}

@injectable()
export class HardwareProxyService implements IHardwareProxyService {
  private readonly _machineService: IMachineService;

  constructor(@inject("IMachineService") machineService: IMachineService) {
    this._machineService = machineService;
  }

  public async LoadDriverAndExecute(
    request: IProxyRequest
  ): Promise<IDriverResponse> {
    // Look up if machine exists and get driver information
    const lookupResult = await this._machineService.GetMachineInformation(
      request.mid
    );

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
