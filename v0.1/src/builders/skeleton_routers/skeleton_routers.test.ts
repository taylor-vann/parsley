// brian taylor vann
// skeleton routers

import { routers } from "./skeleton_routers.ts";

const title = "skeleton routers";
const runTestsAsynchronously = true;

const notFoundReducesCorrectState = () => {
  const assertions: string[] = [];

  if (routers["CONTENT_NODE"]?.["<"] !== "OPEN_NODE") {
    assertions.push("< should return OPEN_NODE");
  }

  if (routers["CONTENT_NODE"]?.["DEFAULT"] !== "CONTENT_NODE") {
    assertions.push("space should return CONTENT_NODE");
  }

  return assertions;
};

const openNodeReducesCorrectState = () => {
  const assertions: string[] = [];

  if (routers["OPEN_NODE"]?.["<"] !== "OPEN_NODE") {
    assertions.push("< should return OPEN_NODE");
  }

  if (routers["OPEN_NODE"]?.["/"] !== "CLOSE_NODE") {
    assertions.push("/ should return CLOSE_NODE");
  }

  if (routers["OPEN_NODE"]?.[" "] !== "CONTENT_NODE") {
    assertions.push("space should return CONTENT_NODE");
  }

  if (routers["OPEN_NODE"]?.["DEFAULT"] !== "OPEN_NODE_VALID") {
    assertions.push("space should return OPEN_NODE_VALID");
  }

  return assertions;
};

const openNodeValidReducesCorrectState = () => {
  const assertions: string[] = [];

  if (routers["OPEN_NODE_VALID"]?.["<"] !== "OPEN_NODE") {
    assertions.push("< should return OPEN_NODE");
  }
  if (routers["OPEN_NODE_VALID"]?.["/"] !== "SELF_CLOSING_NODE_VALID") {
    assertions.push("/ should return SELF_CLOSING_NODE_VALID");
  }
  if (routers["OPEN_NODE_VALID"]?.[">"] !== "OPEN_NODE_CONFIRMED") {
    assertions.push("> should return OPEN_NODE_CONFIRMED");
  }
  if (routers["OPEN_NODE_VALID"]?.["DEFAULT"] !== "OPEN_NODE_VALID") {
    assertions.push("space should return OPEN_NODE_VALID");
  }

  return assertions;
};

const independentNodeValidReducesCorrectState = () => {
  const assertions: string[] = [];

  if (routers["SELF_CLOSING_NODE_VALID"]?.["<"] !== "OPEN_NODE") {
    assertions.push("< should return OPEN_NODE");
  }
  if (
    routers["SELF_CLOSING_NODE_VALID"]?.["DEFAULT"] !==
    "SELF_CLOSING_NODE_VALID"
  ) {
    assertions.push("space should return SELF_CLOSING_NODE_VALID");
  }

  return assertions;
};

const closeNodeReducesCorrectState = () => {
  const assertions: string[] = [];

  if (routers["CLOSE_NODE"]?.["<"] !== "OPEN_NODE") {
    assertions.push("< should return OPEN_NODE");
  }
  if (routers["CLOSE_NODE"]?.["DEFAULT"] !== "CLOSE_NODE_VALID") {
    assertions.push("space should return CLOSE_NODE_VALID");
  }
  if (routers["CLOSE_NODE"]?.[" "] !== "CONTENT_NODE") {
    assertions.push("space should return CONTENT_NODE");
  }

  return assertions;
};

const closeNodeValidReducesCorrectState = () => {
  const assertions: string[] = [];

  if (routers["CLOSE_NODE_VALID"]?.["<"] !== "OPEN_NODE") {
    assertions.push("< should return OPEN_NODE");
  }
  if (routers["CLOSE_NODE_VALID"]?.[">"] !== "CLOSE_NODE_CONFIRMED") {
    assertions.push("> should return CLOSE_NODE_CONFIRMED");
  }
  if (routers["CLOSE_NODE_VALID"]?.["DEFAULT"] !== "CLOSE_NODE_VALID") {
    assertions.push("space should return CLOSE_NODE_VALID");
  }

  return assertions;
};

const tests = [
  notFoundReducesCorrectState,
  openNodeReducesCorrectState,
  openNodeValidReducesCorrectState,
  independentNodeValidReducesCorrectState,
  closeNodeReducesCorrectState,
  closeNodeValidReducesCorrectState,
];

const unitTestSkeletonRouters = {
  title,
  tests,
  runTestsAsynchronously,
};

export { unitTestSkeletonRouters };