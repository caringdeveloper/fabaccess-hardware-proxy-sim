export default interface IUserInformation {
  Id: string;
  AllowedMachines: AllowedMachines[];
  HasSafetyBriefing: boolean;
}

interface AllowedMachines {
  Id: string;
  Mid: number;
}
