import {
  ApiClient,
  IApiClient,
  MockApiClient
} from "../2 - Domain/Networking/ApiClient";
import { Container, decorate, injectable, interfaces } from "inversify";
import {
  HardwareProxyService,
  IHardwareProxyService
} from "../2 - Domain/Services/HardwareProxyService";
import {
  IMachineService,
  MachineService
} from "../2 - Domain/Services/MachineService";
import { IStateManager, StateManager } from "../2 - Domain/StateManager";
import { IUserService, UserService } from "../2 - Domain/Services/UserService";
import Printer, { IPrinter } from "../2 - Domain/Drivers/Printer";

import { Controller } from "tsoa";
import { HardwareProxyController } from "../1 - REST Interface/Controllers/HardwareProxyController";

decorate(injectable(), Controller);

const iocContainer = new Container();

iocContainer
  .bind<HardwareProxyController>(HardwareProxyController)
  .to(HardwareProxyController)
  .inTransientScope();

iocContainer
  .bind<IHardwareProxyService>("IHardwareProxyService")
  .to(HardwareProxyService)
  .inTransientScope();

iocContainer
  .bind<IMachineService>("IMachineService")
  .to(MachineService)
  .inTransientScope();

iocContainer
  .bind<IUserService>("IUserService")
  .to(UserService)
  .inTransientScope();

iocContainer
  .bind<IPrinter>("IPrinter")
  .to(Printer)
  .inTransientScope();

iocContainer
  .bind<IStateManager>("IStateManager")
  .to(StateManager)
  .inSingletonScope();

iocContainer
  .bind<IApiClient>("IApiClient")
  .to(MockApiClient)
  .inSingletonScope();

export { iocContainer };
