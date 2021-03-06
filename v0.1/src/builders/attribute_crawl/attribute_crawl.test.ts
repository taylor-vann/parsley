// brian taylor vann
// attribute crawl
import type { Template } from "../../type_flyweight/template.ts";
import type {
  ExplicitAttributeAction,
  InjectedAttributeAction,
} from "../../type_flyweight/attribute_crawl.ts";

import { samestuff } from "../../test_deps.ts";
import { create, incrementTarget } from "../../text_vector/text_vector.ts";
import { crawlForAttribute } from "./attribute_crawl.ts";

type TextTextInterpolator = <N, A>(
  templateArray: TemplateStringsArray,
  ...injections: A[]
) => Template<N, A>;

const RECURSION_SAFETY = 256;

const title = "attribute_crawl";
const runTestsAsynchronously = true;

const testTextInterpolator: TextTextInterpolator = (
  templateArray,
  ...injections
) => {
  return { templateArray, injections };
};

const emptyString = () => {
  const assertions = [];

  const template = testTextInterpolator``;
  const vector = create();

  const results = crawlForAttribute(template, vector);

  if (results !== undefined) {
    assertions.push("this should have failed");
  }

  return assertions;
};

const emptySpaceString = () => {
  const assertions = [];

  const template = testTextInterpolator` `;
  const vector = create();

  let safety = 0;
  while (incrementTarget(template, vector) && safety < RECURSION_SAFETY) {
    safety += 1;
  }

  const results = crawlForAttribute(template, vector);

  if (results !== undefined) {
    assertions.push("this should have failed");
  }

  return assertions;
};

const emptyMultiSpaceString = () => {
  const assertions = [];

  const template = testTextInterpolator`   `;
  const vector = create();

  let safety = 0;
  while (incrementTarget(template, vector) && safety < RECURSION_SAFETY) {
    safety += 1;
  }

  const results = crawlForAttribute(template, vector);

  if (results !== undefined) {
    assertions.push("this should have failed");
  }

  return assertions;
};

const implicitString = () => {
  const assertions = [];

  const expectedResults = {
    kind: "IMPLICIT_ATTRIBUTE",

    attributeVector: {
      origin: {
        arrayIndex: 0,
        stringIndex: 0,
      },
      target: {
        arrayIndex: 0,
        stringIndex: 6,
      },
    },
  };

  const template = testTextInterpolator`checked`;
  const vector = create();

  let safety = 0;
  while (incrementTarget(template, vector) && safety < RECURSION_SAFETY) {
    safety += 1;
  }

  const results = crawlForAttribute(template, vector);

  if (!samestuff(expectedResults, results)) {
    assertions.push("unexpected results found.");
  }

  return assertions;
};

const implicitStringWithTrailingSpaces = () => {
  const assertions = [];

  const expectedResults = {
    kind: "IMPLICIT_ATTRIBUTE",

    attributeVector: {
      origin: {
        arrayIndex: 0,
        stringIndex: 0,
      },
      target: {
        arrayIndex: 0,
        stringIndex: 6,
      },
    },
  };

  const template = testTextInterpolator`checked    `;
  const vector = create();

  let safety = 0;
  while (incrementTarget(template, vector) && safety < RECURSION_SAFETY) {
    safety += 1;
  }

  const results = crawlForAttribute(template, vector);

  if (!samestuff(expectedResults, results)) {
    assertions.push("unexpected results found.");
  }

  return assertions;
};

const malformedExplicitString = () => {
  const assertions = [];

  const template = testTextInterpolator`checked=`;
  const vector = create();

  let safety = 0;
  while (incrementTarget(template, vector) && safety < RECURSION_SAFETY) {
    safety += 1;
  }

  const results = crawlForAttribute(template, vector);

  if (results !== undefined) {
    assertions.push("this should not have returned results");
  }

  return assertions;
};

const almostExplicitString = () => {
  const assertions = [];

  const template = testTextInterpolator`checked="`;
  const vector = create();

  let safety = 0;
  while (incrementTarget(template, vector) && safety < RECURSION_SAFETY) {
    safety += 1;
  }

  const results = crawlForAttribute(template, vector);
  if (results !== undefined) {
    assertions.push("this should not have returned results");
  }

  return assertions;
};

const emptyExplicitString = () => {
  const assertions = [];

  const expectedResults: ExplicitAttributeAction = {
    kind: "EXPLICIT_ATTRIBUTE",
    attributeVector: {
      origin: {
        arrayIndex: 0,
        stringIndex: 0,
      },
      target: {
        arrayIndex: 0,
        stringIndex: 6,
      },
    },
    valueVector: {
      origin: {
        arrayIndex: 0,
        stringIndex: 8,
      },
      target: {
        arrayIndex: 0,
        stringIndex: 9,
      },
    },
  };

  const template = testTextInterpolator`checked=""`;
  const vector = create();

  let safety = 0;
  while (incrementTarget(template, vector) && safety < RECURSION_SAFETY) {
    safety += 1;
  }

  const results = crawlForAttribute(template, vector);
  if (!samestuff(expectedResults, results)) {
    assertions.push("unexpected results found.");
  }

  return assertions;
};

const validExplicitString = () => {
  const assertions = [];

  const expectedResults: ExplicitAttributeAction = {
    kind: "EXPLICIT_ATTRIBUTE",

    attributeVector: {
      origin: {
        arrayIndex: 0,
        stringIndex: 0,
      },
      target: {
        arrayIndex: 0,
        stringIndex: 6,
      },
    },
    valueVector: {
      origin: {
        arrayIndex: 0,
        stringIndex: 8,
      },
      target: {
        arrayIndex: 0,
        stringIndex: 16,
      },
    },
  };

  const template = testTextInterpolator`checked="checked"`;
  const vector = create();

  let safety = 0;
  while (incrementTarget(template, vector) && safety < RECURSION_SAFETY) {
    safety += 1;
  }

  const results = crawlForAttribute(template, vector);

  if (!samestuff(expectedResults, results)) {
    assertions.push("unexpected results found.");
  }

  return assertions;
};

const validExplicitStringWithTrailingSpaces = () => {
  const assertions = [];

  const expectedResults: ExplicitAttributeAction = {
    kind: "EXPLICIT_ATTRIBUTE",

    attributeVector: {
      origin: {
        arrayIndex: 0,
        stringIndex: 0,
      },
      target: {
        arrayIndex: 0,
        stringIndex: 6,
      },
    },
    valueVector: {
      origin: {
        arrayIndex: 0,
        stringIndex: 8,
      },
      target: {
        arrayIndex: 0,
        stringIndex: 19,
      },
    },
  };

  const template = testTextInterpolator`checked="checked   "`;
  const vector = create();

  let safety = 0;
  while (incrementTarget(template, vector) && safety < RECURSION_SAFETY) {
    safety += 1;
  }

  const results = crawlForAttribute(template, vector);

  if (!samestuff(expectedResults, results)) {
    assertions.push("unexpected results found.");
  }

  return assertions;
};

const injectedString = () => {
  const assertions = [];

  const expectedResults: InjectedAttributeAction = {
    kind: "INJECTED_ATTRIBUTE",

    attributeVector: {
      origin: {
        arrayIndex: 0,
        stringIndex: 0,
      },
      target: {
        arrayIndex: 0,
        stringIndex: 6,
      },
    },
    valueVector: {
      origin: {
        arrayIndex: 0,
        stringIndex: 8,
      },
      target: {
        arrayIndex: 1,
        stringIndex: 0,
      },
    },
    injectionID: 0,
  };

  const template = testTextInterpolator`checked="${"hello"}"`;
  const vector = create();

  let safety = 0;
  while (incrementTarget(template, vector) && safety < RECURSION_SAFETY) {
    safety += 1;
  }

  const results = crawlForAttribute(template, vector);

  if (!samestuff(expectedResults, results)) {
    assertions.push("unexpected results found.");
  }

  if (results === undefined) {
    assertions.push("this should have returned results");
  }

  return assertions;
};

const malformedInjectedString = () => {
  const assertions = [];

  const template = testTextInterpolator`checked="${"hello"}`;
  const vector = create();

  let safety = 0;
  while (incrementTarget(template, vector) && safety < RECURSION_SAFETY) {
    safety += 1;
  }

  const results = crawlForAttribute(template, vector);
  if (results !== undefined) {
    assertions.push("this should have returned results");
  }

  return assertions;
};

const malformedInjectedStringWithTrailingSpaces = () => {
  const assertions = [];

  const template = testTextInterpolator`checked="${"hello"} "`;
  const vector = create();

  let safety = 0;
  while (incrementTarget(template, vector) && safety < RECURSION_SAFETY) {
    safety += 1;
  }

  const results = crawlForAttribute(template, vector);
  if (results !== undefined) {
    assertions.push("this should not have returned results");
  }

  return assertions;
};

const malformedInjectedStringWithStartingSpaces = () => {
  const assertions = [];

  const template = testTextInterpolator`checked=" ${"hello"}"`;
  const vector = create();

  let safety = 0;
  while (incrementTarget(template, vector) && safety < RECURSION_SAFETY) {
    safety += 1;
  }

  const results = crawlForAttribute(template, vector);
  if (results !== undefined) {
    assertions.push("this should not have returned results");
  }

  return assertions;
};

const htmlAddressWithSpecialCharacters = () => {
  const assertions = [];

  const expectedResults: ExplicitAttributeAction = {
    kind: "EXPLICIT_ATTRIBUTE",
    valueVector: {
      origin: {
        arrayIndex: 0,
        stringIndex: 5,
      },
      target: {
        arrayIndex: 0,
        stringIndex: 65,
      },
    },
    attributeVector: {
      origin: {
        arrayIndex: 0,
        stringIndex: 0,
      },
      target: {
        arrayIndex: 0,
        stringIndex: 3,
      },
    },
  };

  const template = testTextInterpolator
    `href="http://supersalad.com/?=the-death-star-is-quite-operational"`;
  const vector = create();

  let safety = 0;
  while (incrementTarget(template, vector) && safety < RECURSION_SAFETY) {
    safety += 1;
  }

  const results = crawlForAttribute(template, vector);

  if (!samestuff(expectedResults, results)) {
    assertions.push("unexpected results found.");
  }

  if (results === undefined) {
    assertions.push("this should have returned results");
  }

  return assertions;
};

const tests = [
  emptyString,
  emptySpaceString,
  emptyMultiSpaceString,
  implicitString,
  implicitStringWithTrailingSpaces,
  malformedExplicitString,
  almostExplicitString,
  emptyExplicitString,
  validExplicitString,
  validExplicitStringWithTrailingSpaces,
  injectedString,
  malformedInjectedString,
  malformedInjectedStringWithTrailingSpaces,
  malformedInjectedStringWithStartingSpaces,
  htmlAddressWithSpecialCharacters,
];

const unitTestAttributeCrawl = {
  title,
  tests,
  runTestsAsynchronously,
};

export { unitTestAttributeCrawl };
