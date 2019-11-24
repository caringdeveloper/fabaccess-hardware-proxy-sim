import { inject, injectable } from "inversify";

export interface IUserService {
  IsUserPermitted(userId: string, machineId: string): Promise<boolean>;
}

@injectable()
export class UserService implements IUserService {
  public async IsUserPermitted(
    userId: string,
    machineId: string
  ): Promise<boolean> {
    // TODO: Ask backend if user is permitted

    return true;
  }
}
