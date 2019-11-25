import { inject, injectable } from "inversify";

import { IStateManager } from "../StateManager";
import lodash from "lodash";
import { IApiClient } from "../Networking/ApiClient";
import IMachineInformation from "../Networking/DTOs/IMachineInformation";

export interface IMachineService {
  IsMachineOccupied(machineId: number): Promise<{ uid: string } | null>;
  IsMachineOnline(machineId: string): Promise<boolean>;
  GetMachineInformation(machineId: number): Promise<IMachineInformation>;
}

@injectable()
export class MachineService implements IMachineService {
  private readonly _stateManager: IStateManager;
  private readonly _apiClient: IApiClient;

  constructor(
    @inject("IStateManager") stateManager: IStateManager,
    @inject("IApiClient") apiClient: IApiClient
  ) {
    this._stateManager = stateManager;
    this._apiClient = apiClient;
  }

  public async GetMachineInformation(
    machineId: number
  ): Promise<IMachineInformation> {
    const machineInformation = await this._apiClient.GetMachineInformation(
      machineId
    );

    return machineInformation;
  }

  public async IsMachineOccupied(
    machineId: number
  ): Promise<{ uid: string } | null> {
    const machinesInUse = this._stateManager.GetState().machinesInUse;
    const occupied = lodash.find(machinesInUse, t => t.mid === machineId);

    if (!lodash.isUndefined(occupied)) return occupied;

    return null;
  }

  public async IsMachineOnline(machineId: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
}
