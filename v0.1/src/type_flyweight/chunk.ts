// brian taylor vann
// chunk types

import type { ReferenceMap } from "./render.ts";

// UNMOUNTED      // siblings have no parent
// MOUNTED        // siblings have a parent
// CONNECTED      // descendants are attached to siblings
// DISCONNECTED   // desendants are removed from siblings

type ChunkEffect = {
  connected: boolean;
  mounted: boolean;
  timestamp: number;
};

interface ChunkBase<N> {
  parentNode?: N;
  leftNode?: N;
  siblings: N[];
  effect: ChunkEffect;

  // attach siblings to parent
  // return leftmost node
  mount(parentNode?: N, leftNode?: N): N | undefined;

  // remove siblings but don't disconnect descendants
  unmount(): void;

  // update using previous parameters
  bang(): void;

  // get rendered reference pointers (*)
  getReferences(): ReferenceMap<N> | undefined;

  // if template fundamentally changes?
  //   unmount, disconnect, render
  //
  // if siblings are different
  //   create new siblings
  update(p: unknown): void;

  // remove siblings
  // call chunker.disconnect()
  disconnect(): void;

  // return siblings so parent chunk can mount
  getSiblings(): N[];

  // return status of chunk represented by chunk effect
  getEffect(): ChunkEffect;
}

interface BangerBase<N> {
  bang(): void;
  getReferences(): ReferenceMap<N> | undefined;
}

export type { BangerBase, ChunkBase, ChunkEffect };
