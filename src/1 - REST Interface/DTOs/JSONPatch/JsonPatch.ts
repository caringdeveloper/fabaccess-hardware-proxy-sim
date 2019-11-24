export interface PatchDocument {
  op: "add" | "remove" | "replace" | "move" | "copy" | "test";
  from?: string;
  path?: string;
  value?: any;
}
