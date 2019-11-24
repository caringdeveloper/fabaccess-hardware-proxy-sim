import { inject, injectable } from "inversify";

import { IStateManager } from "../StateManager";
import lodash from "lodash";

export interface IMachineService {
  IsMachineOccupied(machineId: string): Promise<{ uid: string } | null>;
  IsMachineOnline(machineId: string): Promise<boolean>;
  GetMachineInformation(machineId: string): Promise<any>;
}

@injectable()
export class MachineService implements IMachineService {
  private readonly _stateManager: IStateManager;

  constructor(@inject("IStateManager") stateManager: IStateManager) {
    this._stateManager = stateManager;
  }

  public async GetMachineInformation(machineId: string): Promise<any> {
    // TODO: Ask backend for machine information

    throw new Error("Method not implemented.");
  }

  public async IsMachineOccupied(
    machineId: string
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
