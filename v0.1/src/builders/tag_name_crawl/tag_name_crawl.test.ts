// brian taylor vann
// tag name crawl

import type { Template } from "../../type_flyweight/template.ts";

import { samestuff } from "../../test_deps.ts";
import { create, incrementTarget } from "../../text_vector/text_vector.ts";
import { crawlForTagName } from "./tag_name_crawl.ts";

type TextTextInterpolator = <N, A>(
  templateArray: TemplateStringsArray,
  ...injections: A[]
) => Template<N, A>;

const RECURSION_SAFETY = 256;

const testTextInterpolator: TextTextInterpolator = (
  templateArray,
  ...injections
) => {
  return { templateArray, injections };
};

const title = "tag_name_crawl";
const runTestsAsynchronously = true;

const testEmptyString = () => {
  const assertions = [];

  const template = testTextInterpolator``;
  const vector = create();

  const results = crawlForTagName(template, vector);

  if (results !== undefined) {
    assertions.push("this should have failed");
  }

  return assertions;
};

const testEmptySpaceString = () => {
  const assertions = [];

  const template = testTextInterpolator` `;
  const vector = create();

  const results = crawlForTagName(template, vector);

  if (results !== undefined) {
    assertions.push("this should have failed");
  }

  return assertions;
};

const testSingleCharacterString = () => {
  const assertions = [];

  const expectedResults = {
    origin: {
      arrayIndex: 0,
      stringIndex: 0,
    },
    target: {
      arrayIndex: 0,
      stringIndex: 0,
    },
  };

  const template = testTextInterpolator`a`;
  const vector = create();

  const results = crawlForTagName(template, vector);

  if (!samestuff(expectedResults, results)) {
    assertions.push("unexpected tag name results happen.");
  }

  return assertions;
};

const testCharaceterString = () => {
  const assertions = [];

  const expectedResults = {
    origin: {
      arrayIndex: 0,
      stringIndex: 0,
    },
    target: {
      arrayIndex: 0,
      stringIndex: 0,
    },
  };

  const template = testTextInterpolator`a `;
  const vector = create();

  let safety = 0;
  while (incrementTarget(template, vector) && safety < RECURSION_SAFETY) {
    safety += 1;
  }

  const results = crawlForTagName(template, vector);

  if (!samestuff(expectedResults, results)) {
    assertions.push("unexpected tag name results happen.");
  }

  return assertions;
};

const testMultiCharaceterString = () => {
  const assertions = [];
  const expectedResults = {
    origin: {
      arrayIndex: 0,
      stringIndex: 0,
    },
    target: {
      arrayIndex: 0,
      stringIndex: 2,
    },
  };

  const template = testTextInterpolator`aaa `;
  const vector = create();

  let safety = 0;
  while (incrementTarget(template, vector) && safety < RECURSION_SAFETY) {
    safety += 1;
  }

  const results = crawlForTagName(template, vector);

  if (!samestuff(expectedResults, results)) {
    assertions.push("unexpected tag name results happen.");
  }

  return assertions;
};

const testMultiCharaceterStringWithTrailingSpaces = () => {
  const assertions = [];
  const expectedResults = {
    origin: {
      arrayIndex: 0,
      stringIndex: 0,
    },
    target: {
      arrayIndex: 0,
      stringIndex: 2,
    },
  };

  const template = testTextInterpolator`aaa     `;
  const vector = create();

  let safety = 0;
  while (incrementTarget(template, vector) && safety < RECURSION_SAFETY) {
    safety += 1;
  }

  const results = crawlForTagName(template, vector);

  if (!samestuff(expectedResults, results)) {
    assertions.push("unexpected tag name results happen.");
  }

  return assertions;
};

const tests = [
  testEmptyString,
  testEmptySpaceString,
  testSingleCharacterString,
  testCharaceterString,
  testMultiCharaceterString,
  testMultiCharaceterStringWithTrailingSpaces,
];

const unitTestTagNameCrawl = {
  title,
  tests,
  runTestsAsynchronously,
};

export { unitTestTagNameCrawl };
