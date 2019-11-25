import { Utils, Status } from "../Utils/Utils";
import { injectable, inject } from "inversify";
import { IStateManager } from "../StateManager";
import { IUserService } from "../Services/UserService";
import { IMachineService } from "../Services/MachineService";
import Driver from "./Driver";
import IDriverResponse from "../DomainObjects/IDriverResponse";

export interface IPrinter {}

@injectable()
export default class Printer extends Driver {
  private _loginDone: boolean = false;

  private readonly _stateManager: IStateManager;
  private readonly _machineService: IMachineService;
  private readonly _userService: IUserService;

  constructor(
    @inject("IStateManager") stateManager: IStateManager,
    @inject("IUserService") userService: IUserService,
    @inject("IMachineService") machineService: IMachineService
  ) {
    super();

    this._stateManager = stateManager;
    this._machineService = machineService;
    this._userService = userService;

    // Build command map for this driver
    this.commandMap.set("CARDDOWN", this.HandleCardDown.bind(this));
    this.commandMap.set("CARDREMOVED", this.HandleCardRemoved.bind(this));
    this.commandMap.set("BUTTONCLICKED", this.HandleButtonClicked.bind(this));
  }

  private async HandleCardDown(payload: any): Promise<IDriverResponse | null> {
    // mid --> Machine ID
    // uid --> User ID
    const { mid, uid }: { mid: number; uid: string } = payload;

    const informationPromises: any = [
      // Get Socket IP (Check in backend)
      this._machineService.GetMachineInformation(mid),
      // Check if user is permitted (Check in backend)
      this._userService.IsUserPermitted(uid, mid),
      // Check if machine is occupied (Check in store)
      this._machineService.IsMachineOccupied(mid)
    ];

    try {
      const {
        0: machineInformation,
        1: isUserPermitted,
        2: isMachineOccupied
      } = await Promise.all<any, boolean, { uid: string } | null>(
        informationPromises
      );

      if (!isUserPermitted) {
        return Utils.GenerateReturn(
          Status.Warning,
          "Access denied",
          "Not permitted"
        );
      }

      if (isMachineOccupied) {
        // Returning user?
        if (isMachineOccupied.uid === uid) {
          return Utils.GenerateMenu(
            Status.Neutral,
            "Welcome back",
            "Shutdown|Cancel"
          );
        }

        // Not a returning user. Do not allow interaction
        return Utils.GenerateReturn(
          Status.Warning,
          "Machine occupied",
          "Ask FabLab staff"
        );
      }

      // TODO: Turn machine on
      await this.TurnMachineOn();

      // Set this machine as started inside of the application store
      this._stateManager.Dispatch("MACHINE_STARTED", { mid, uid });
      return Utils.GenerateReturn(
        Status.Success,
        "Access granted",
        "Machine started"
      );
    } catch (err) {
      return Utils.GenerateReturn(Status.Warning, "Error", "Not turned on");
    }
  }

  private async HandleCardRemoved(
    payload: any
  ): Promise<IDriverResponse | null> {
    return Utils.GenerateEmptyReturn();
  }

  private async HandleButtonClicked(
    payload: any
  ): Promise<IDriverResponse | null> {
    const {
      mid,
      uid,
      selectedIndex
    }: { mid: number; uid: string; selectedIndex: number } = payload;

    const informationPromises: any = [
      // Get Socket IP (Check in backend)
      this._machineService.GetMachineInformation(mid),
      // Check if user is permitted (Check in backend)
      this._userService.IsUserPermitted(uid, mid),
      // Check if machine is occupied (Check in store)
      this._machineService.IsMachineOccupied(mid)
    ];

    try {
      const {
        0: machineInformation,
        1: isUserPermitted,
        2: isMachineOccupied
      } = await Promise.all<any, boolean, { uid: string } | null>(
        informationPromises
      );

      if (!isUserPermitted) {
        return Utils.GenerateReturn(
          Status.Warning,
          "Access denied",
          "Not permitted"
        );
      }

      if (isMachineOccupied) {
        if (isMachineOccupied.uid !== uid) {
          return Utils.GenerateReturn(
            Status.Warning,
            "Machine occupied",
            "Ask FabLab staff"
          );
        }
      }

      switch (selectedIndex) {
        case 0:
          // TODO: Turn machine off
          await this.TurnMachineOff();

          // Mark machine as stopped
          this._stateManager.Dispatch("MACHINE_STOPPED", { mid });
          return Utils.GenerateReturn(Status.Neutral, "Thanks", "Keep hacking");

        default:
          return Utils.GenerateEmptyReturn();
      }
    } catch (err) {
      return Utils.GenerateReturn(Status.Warning, "Error", "Not turned off");
    }
  }

  private async TurnMachineOn(): Promise<void> {}
  private async TurnMachineOff(): Promise<void> {}
}
