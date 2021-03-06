// brian taylor vann
// skeleton crawl

import type { Template } from "../../type_flyweight/template.ts";

import { samestuff } from "../../test_deps.ts";
import { crawl } from "./skeleton_crawl.ts";

type TextTextInterpolator = <N, A>(
  templateArray: TemplateStringsArray,
  ...injections: A[]
) => Template<N, A>;

const testTextInterpolator: TextTextInterpolator = (
  templateArray,
  ...injections
) => {
  return { templateArray, injections };
};

const title = "skeleton crawl";
const runTestsAsynchronously = true;

const findNothingWhenThereIsPlainText = () => {
  const assertions: string[] = [];

  const expectedResults = {
    nodeType: "CONTENT",
    vector: {
      origin: {
        arrayIndex: 0,
        stringIndex: 0,
      },
      target: {
        arrayIndex: 0,
        stringIndex: 20,
      },
    },
  };

  const testBlank = testTextInterpolator`no nodes to be found!`;

  const results = crawl(testBlank);

  if (!samestuff(expectedResults, results)) {
    assertions.push("unexpected results found.");
  }

  return assertions;
};

const findParagraphInPlainText = () => {
  const assertions: string[] = [];

  const expectedResults = {
    nodeType: "OPENED_FOUND",
    vector: {
      origin: {
        arrayIndex: 0,
        stringIndex: 0,
      },
      target: {
        arrayIndex: 0,
        stringIndex: 2,
      },
    },
  };

  const testOpenNode = testTextInterpolator`<p>`;

  const results = crawl(testOpenNode);

  if (!samestuff(expectedResults, results)) {
    assertions.push("unexpected results found.");
  }

  return assertions;
};

const findImageInPlainText = () => {
  const assertions: string[] = [];

  const expectedResults = {
    nodeType: "OPENED_FOUND",
    vector: {
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

  const testOpenNode = testTextInterpolator`<image>`;

  const results = crawl(testOpenNode);

  if (!samestuff(expectedResults, results)) {
    assertions.push("unexpected results found.");
  }

  return assertions;
};

const findCloseParagraphInPlainText = () => {
  const assertions: string[] = [];

  const expectedResults = {
    nodeType: "CLOSED_FOUND",
    vector: {
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

  const testTextCloseNode = testTextInterpolator`</p>`;

  const results = crawl(testTextCloseNode);

  if (!samestuff(expectedResults, results)) {
    assertions.push("unexpected results found.");
  }

  return assertions;
};

const findIndependentParagraphInPlainText = () => {
  const assertions: string[] = [];

  const expectedResults = {
    nodeType: "INDEPENDENT_FOUND",
    vector: {
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

  const testTextIndependentNode = testTextInterpolator`<p/>`;

  const results = crawl(testTextIndependentNode);

  if (!samestuff(expectedResults, results)) {
    assertions.push("unexpected results found.");
  }

  return assertions;
};

const findOpenParagraphInTextWithArgs = () => {
  const assertions: string[] = [];

  const expectedResults = {
    nodeType: "OPENED_FOUND",
    vector: {
      origin: {
        arrayIndex: 1,
        stringIndex: 1,
      },
      target: {
        arrayIndex: 1,
        stringIndex: 8,
      },
    },
  };

  const testTextWithArgs = testTextInterpolator
    `an ${"example"} <buster>${"!"}</buster>`;

  const results = crawl(testTextWithArgs);

  if (!samestuff(expectedResults, results)) {
    assertions.push("unexpected results found.");
  }

  return assertions;
};

const notFoundInUgglyMessText = () => {
  const assertions: string[] = [];

  const expectedResults = {
    nodeType: "CONTENT",
    vector: {
      origin: {
        arrayIndex: 0,
        stringIndex: 0,
      },
      target: {
        arrayIndex: 2,
        stringIndex: 0,
      },
    },
  };

  const testInvalidUgglyMess = testTextInterpolator
    `an <${"invalid"}p> example${"!"}`;

  const results = crawl(testInvalidUgglyMess);

  if (!samestuff(expectedResults, results)) {
    assertions.push("unexpected results found.");
  }

  return assertions;
};

const notFoundInReallyUgglyMessText = () => {
  const assertions: string[] = [];

  const expectedResults = {
    nodeType: "CONTENT",
    vector: {
      origin: {
        arrayIndex: 0,
        stringIndex: 0,
      },
      target: {
        arrayIndex: 2,
        stringIndex: 0,
      },
    },
  };

  const testInvalidUgglyMess = testTextInterpolator`an example${"!"}${"?"}`;
  const results = crawl(testInvalidUgglyMess);

  if (!samestuff(expectedResults, results)) {
    assertions.push("unexpected results found.");
  }

  return assertions;
};

const invalidCloseNodeWithArgs = () => {
  const assertions: string[] = [];

  const expectedResults = {
    nodeType: "CONTENT",
    vector: {
      origin: {
        arrayIndex: 0,
        stringIndex: 0,
      },
      target: {
        arrayIndex: 1,
        stringIndex: 1,
      },
    },
  };

  const testInvlaidCloseNodeWithArgs = testTextInterpolator
    `closed </${"example"}p>`;

  const results = crawl(testInvlaidCloseNodeWithArgs);

  if (!samestuff(expectedResults, results)) {
    assertions.push("unexpected results found.");
  }

  return assertions;
};

const validCloseNodeWithArgs = () => {
  const assertions: string[] = [];

  const expectedResults = {
    nodeType: "CLOSED_FOUND",
    vector: {
      origin: {
        arrayIndex: 0,
        stringIndex: 7,
      },
      target: {
        arrayIndex: 1,
        stringIndex: 0,
      },
    },
  };

  const testValidCloseNodeWithArgs = testTextInterpolator
    `closed </p ${"example"}>`;

  const results = crawl(testValidCloseNodeWithArgs);

  if (!samestuff(expectedResults, results)) {
    assertions.push("unexpected results found.");
  }

  return assertions;
};

const invalidIndependentNodeWithArgs = () => {
  const assertions: string[] = [];

  const expectedResults = {
    nodeType: "CONTENT",
    vector: {
      origin: {
        arrayIndex: 0,
        stringIndex: 0,
      },
      target: {
        arrayIndex: 1,
        stringIndex: 2,
      },
    },
  };

  const testInvalidIndependentNode = testTextInterpolator
    `independent <${"example"}p/>`;

  const results = crawl(testInvalidIndependentNode);

  if (!samestuff(expectedResults, results)) {
    assertions.push("unexpected results found.");
  }

  return assertions;
};

const validIndependentNodeWithArgs = () => {
  const assertions: string[] = [];

  const expectedResults = {
    nodeType: "INDEPENDENT_FOUND",
    vector: {
      origin: {
        arrayIndex: 0,
        stringIndex: 12,
      },
      target: {
        arrayIndex: 1,
        stringIndex: 3,
      },
    },
  };

  const testValidIndependentNode = testTextInterpolator
    `independent <p ${"example"} / >`;

  const results = crawl(testValidIndependentNode);

  if (!samestuff(expectedResults, results)) {
    assertions.push("unexpected results found.");
  }

  return assertions;
};

const invalidOpenNodeWithArgs = () => {
  const assertions: string[] = [];

  const expectedResults = {
    nodeType: "CONTENT",
    vector: {
      origin: {
        arrayIndex: 0,
        stringIndex: 0,
      },
      target: {
        arrayIndex: 1,
        stringIndex: 1,
      },
    },
  };

  const testInvalidOpenNode = testTextInterpolator`open <${"example"}p>`;

  const results = crawl(testInvalidOpenNode);

  if (!samestuff(expectedResults, results)) {
    assertions.push("unexpected results found.");
  }

  return assertions;
};

const validOpenNodeWithArgs = () => {
  const assertions: string[] = [];

  const expectedResults = {
    nodeType: "OPENED_FOUND",
    vector: {
      origin: {
        arrayIndex: 0,
        stringIndex: 5,
      },
      target: {
        arrayIndex: 1,
        stringIndex: 0,
      },
    },
  };

  const testValidOpenNode = testTextInterpolator`open <p ${"example"}>`;

  const results = crawl(testValidOpenNode);

  if (!samestuff(expectedResults, results)) {
    assertions.push("unexpected results found.");
  }

  return assertions;
};

const findNextCrawlWithPreviousCrawl = () => {
  const assertions: string[] = [];

  const expectedResults = {
    nodeType: "INDEPENDENT_FOUND",
    vector: {
      origin: {
        arrayIndex: 2,
        stringIndex: 0,
      },
      target: {
        arrayIndex: 2,
        stringIndex: 3,
      },
    },
  };

  const testValidOpenNode = testTextInterpolator
    `<p ${"small"}/>${"example"}<p/>`;

  const previousCrawl = crawl(testValidOpenNode);
  const results = crawl(testValidOpenNode, previousCrawl);

  if (!samestuff(expectedResults, results)) {
    assertions.push("unexpected results found.");
  }

  return assertions;
};

const findOneCharacterDescendants = () => {
  const assertions: string[] = [];

  const expectedResults = {
    nodeType: "OPENED_FOUND",
    vector: {
      origin: {
        arrayIndex: 0,
        stringIndex: 0,
      },
      target: {
        arrayIndex: 0,
        stringIndex: 35,
      },
    },
  };

  const testComplexNode = testTextInterpolator
    `<a href="https://superawesome.com" >world</a>`;
  const results = crawl(testComplexNode);

  if (!samestuff(expectedResults, results)) {
    assertions.push("unexpected results found");
  }

  return assertions;
};

const tests = [
  findNothingWhenThereIsPlainText,
  findParagraphInPlainText,
  findImageInPlainText,
  findCloseParagraphInPlainText,
  findIndependentParagraphInPlainText,
  findOpenParagraphInTextWithArgs,
  notFoundInUgglyMessText,
  notFoundInReallyUgglyMessText,
  invalidCloseNodeWithArgs,
  validCloseNodeWithArgs,
  invalidIndependentNodeWithArgs,
  validIndependentNodeWithArgs,
  invalidOpenNodeWithArgs,
  validOpenNodeWithArgs,
  findNextCrawlWithPreviousCrawl,
  findOneCharacterDescendants,
];

const unitTestSkeletonCrawl = {
  title,
  tests,
  runTestsAsynchronously,
};

export { unitTestSkeletonCrawl };
