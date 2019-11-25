import { inject, injectable } from "inversify";
import { IApiClient } from "../Networking/ApiClient";

export interface IUserService {
  IsUserPermitted(userId: string, machineId: number): Promise<boolean>;
}

@injectable()
export class UserService implements IUserService {
  private readonly _apiClient: IApiClient;

  constructor(@inject("IApiClient") apiClient: IApiClient) {
    this._apiClient = apiClient;
  }

  public async IsUserPermitted(
    userId: string,
    machineId: number
  ): Promise<boolean> {
    const userInformation = await this._apiClient.GetUserInformation(userId);

    return (
      userInformation.AllowedMachines.find(t => t.Mid === machineId) !==
      undefined
    );
  }
}
