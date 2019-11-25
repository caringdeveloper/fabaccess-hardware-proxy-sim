import { Controller, Route, Put, Body, Tags, Path, Security } from "tsoa";

import { inject } from "inversify";
import { IHardwareProxyService } from "../../2 - Domain/Services/HardwareProxyService";
import IHardwareProxyResponse from "../DTOs/IHardwareProxyResponse";
import IHardwareProxyRequest from "../DTOs/IHardwareProxyRequest";
import { IProxyRequest } from "../../2 - Domain/DomainObjects/IProxyRequest";
import NotFoundException from "../../2 - Domain/Exceptions/NotFoundException";

@Route("Machines")
@Tags("Machines")
export class HardwareProxyController extends Controller {
  private readonly _hardwareProxyService: IHardwareProxyService;

  constructor(
    @inject("IHardwareProxyService") hardwareProxyService: IHardwareProxyService
  ) {
    super();
    this._hardwareProxyService = hardwareProxyService;
  }

  @Put("{machineId}")
  // @Security("Bearer", ["authorized"])
  public async HandleHardwareProxyRequests(
    @Path() machineId: number,
    @Body() body: IHardwareProxyRequest
  ): Promise<IHardwareProxyResponse> {
    const requestToDomain: IProxyRequest = {
      mid: machineId,
      event: body.event,
      payload: body.payload
    };

    return await this._hardwareProxyService.LoadDriverAndExecute(
      requestToDomain
    );
  }
}
