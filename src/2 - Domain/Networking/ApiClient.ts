import { inject, injectable } from "inversify";

import IMachineInformation from "./DTOs/IMachineInformation";
import IUserInformation from "./DTOs/IUserInformation";
import axios from "axios";

export interface IApiClient {
  GetMachineInformation(machineId: number): Promise<IMachineInformation>;
  GetUserInformation(userId: string): Promise<IUserInformation>;
}

@injectable()
export class ApiClient implements IApiClient {
  public constructor() {}

  public async GetMachineInformation(
    machineId: number
  ): Promise<IMachineInformation> {
    throw new Error("Method not implemented.");
  }

  public async GetUserInformation(userId: string): Promise<IUserInformation> {
    throw new Error("Method not implemented.");
  }
}

@injectable()
export class MockApiClient implements IApiClient {
  // This is fake data. These are awaited responses from the API of the backend
  private readonly _machineResponses = [
    {
      Id: "7e9410c4-7479-4141-a36d-0c73e689a890",
      Mid: 1,
      DriverClass: "Printer",
      SocketIp: "192.168.178.100",
      SocketIndex: 0
    },
    {
      Id: "5e7054b1-259d-4d73-9b42-b52ef75a65d7",
      Mid: 2,
      DriverClass: "Printer",
      SocketIp: "192.168.178.101",
      SocketIndex: 1
    }
  ];

  // This is fake data. These are awaited responses from the API of the backend
  private readonly _userResponses = [
    {
      Id: "4f370837-d031-4ebf-81ce-8917e9e2efe3",
      HasSafetyBriefing: true,
      AllowedMachines: [
        {
          Id: "5e7054b1-259d-4d73-9b42-b52ef75a65d7",
          Mid: 2
        }
      ]
    }
  ];

  public async GetMachineInformation(
    machineId: number
  ): Promise<IMachineInformation | null> {
    const machine = this._machineResponses.find(e => e.Mid === machineId);

    if (!machine) return null;

    return machine;
  }

  public async GetUserInformation(
    userId: string
  ): Promise<IUserInformation | null> {
    const user = this._userResponses.find(e => e.Id === userId);

    if (!user) return null;

    return user;
  }
}
