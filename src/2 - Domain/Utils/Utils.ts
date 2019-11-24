import { IDriverResponse } from "../Drivers/Driver";

export enum Status {
  Success = 1,
  Neutral = 2,
  Warning = 3
}

export class Utils {
  public static GenerateEmptyReturn(): null {
    return null;
  }

  public static GenerateReturn(
    status: Status,
    line1: string,
    line2: string
  ): IDriverResponse {
    return {
      status,
      lcdMessage: {
        line1,
        line2
      }
    };
  }

  public static GenerateMenu(
    status: Status,
    line1: string,
    menu: string
  ): IDriverResponse {
    return {
      status,
      lcdMessage: {
        line1,
        menu
      }
    };
  }
}
