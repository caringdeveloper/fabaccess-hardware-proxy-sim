import { Controller, Route, Get, Path, Query, Put, Security, Body } from "tsoa";

import { inject } from "inversify";
import { IHardwareProxyService } from "../../2 - Domain/Services/HardwareProxyService";
import IHardwareProxyResponse from "../DTOs/IHardwareProxyResponse";
import IHardwareProxyRequest from "../DTOs/IHardwareProxyRequest";

@Route("/")
export class HardwareProxyController extends Controller {
  private readonly _hardwareProxyService: IHardwareProxyService;

  constructor(
    @inject("IHardwareProxyService") hardwareProxyService: IHardwareProxyService
  ) {
    super();
    this._hardwareProxyService = hardwareProxyService;
  }

  @Put()
  @Security("Bearer", ["authorized"])
  public async HandleHardwareProxyRequests(
    @Body() body: IHardwareProxyRequest
  ): Promise<IHardwareProxyResponse> {
    const result = this._hardwareProxyService.LoadDriverAndExecute(body);
    return result;
  }
}
