// brian taylor vann
// parsley test

import { unitTestAttributeCrawl } from "./builders/attribute_crawl/attribute_crawl.test.ts";
import { unitTestBuildIntegrals } from "./builders/build_integrals/build_integrals.test.ts";
import { unitTestBuildRender } from "./builders/build_render/build_render.test.ts";
import { unitTestBuildSkeleton } from "./builders/build_skeleton/build_skeleton.test.ts";
import { unitTestContext } from "./chunk/chunk.test.ts";
import { unitTestSkeletonCrawl } from "./builders/skeleton_crawl/skeleton_crawl.test.ts";
import { unitTestSkeletonRouters } from "./builders/skeleton_routers/skeleton_routers.test.ts";
import { unitTestTagNameCrawl } from "./builders/tag_name_crawl/tag_name_crawl.test.ts";
import { unitTestTestHooks } from "./test_hooks/test_hooks.test.ts";
import { unitTestTextPosition } from "./text_position/text_position.test.ts";
import { unitTestTextVector } from "./text_vector/text_vector.test.ts";

const tests = [
  unitTestAttributeCrawl,
  unitTestBuildIntegrals,
  unitTestBuildRender,
  unitTestBuildSkeleton,
  unitTestContext,
  unitTestSkeletonCrawl,
  unitTestSkeletonRouters,
  unitTestTagNameCrawl,
  unitTestTestHooks,
  unitTestTextPosition,
  unitTestTextVector,
];

export { tests };
