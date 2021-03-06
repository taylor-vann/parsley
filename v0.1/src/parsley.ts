// brian taylor vann
// parsley - xml renderer

// N Node
// A Attributables
// P Params
// S State

export type { BangerBase, ChunkBase } from "./type_flyweight/chunk.ts";
export type { ChunkBaseArray, Chunker } from "./type_flyweight/chunker.ts";

export type {
  CreateNode,
  CreateTextNode,
  GetSibling,
  Hooks,
  InsertDescendant,
  RemoveDescendant,
  SetAttribute,
  SetAttributeParams,
} from "./type_flyweight/hooks.ts";

export type {
  Attach,
  Compose,
  Draw,
  Template,
} from "./type_flyweight/template.ts";

export { Chunk } from "./chunk/chunk.ts";
export { createCustomInterface } from "./create_interface/create_interface.ts";
