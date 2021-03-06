// brian taylor vann
// build render

import type { Hooks } from "../../type_flyweight/hooks.ts";
import type { Template } from "../../type_flyweight/template.ts";
import type { RenderStructure } from "../../type_flyweight/render.ts";
import type {
  ChunkArrayInjectionAction,
  CloseNodeAction,
  ExplicitAttributeAction,
  ImplicitAttributeAction,
  InjectedAttributeAction,
  Integrals,
  NodeAction,
  SelfClosingNodeAction,
  TextAction,
} from "../../type_flyweight/integrals.ts";

import {
  copy,
  decrementTarget,
  getText,
  incrementOrigin,
} from "../../text_vector/text_vector.ts";

interface BuildRenderParams<N, A> {
  hooks: Hooks<N, A>;
  template: Template<N, A>;
  integrals: Integrals;
}
type BuildRender = <N, A>(
  params: BuildRenderParams<N, A>,
) => RenderStructure<N, A>;

interface BuilderHelperParams<N, A, I> {
  rs: RenderStructure<N, A>;
  integral: I;
  hooks: Hooks<N, A>;
}

type BuildHelper<I> = <N, A>(params: BuilderHelperParams<N, A, I>) => void;

type RenderNode = BuildHelper<NodeAction | SelfClosingNodeAction>;
type RenderTextNode = BuildHelper<TextAction>;
type RenderCloseNode = BuildHelper<CloseNodeAction>;
type CreateChunkArrayInjection = BuildHelper<ChunkArrayInjectionAction>;
type RenderAppendExplicitAttribute = BuildHelper<ExplicitAttributeAction>;
type RenderInjectedAttribute = BuildHelper<InjectedAttributeAction>;
type RenderImplicitAttribute = BuildHelper<ImplicitAttributeAction>;

type popSelfClosingNode = <N, A>(rs: RenderStructure<N, A>) => void;

// add integral on to stack
const popSelfClosingNode: popSelfClosingNode = (rs) => {
  const parent = rs.stack[rs.stack.length - 1];
  if (
    parent !== undefined &&
    parent.kind === "NODE" &&
    parent.selfClosing === true
  ) {
    rs.stack.pop();
    rs.lastNodes.pop();
  }
};

const createTextNode: RenderTextNode = ({ hooks, rs, integral }) => {
  // bounce through stack for self closing nodes
  popSelfClosingNode(rs);

  const text = getText(rs.template, integral.textVector);
  if (text === undefined) {
    return;
  }

  const descendant = hooks.createTextNode(text);
  const parentNode = rs.stack[rs.stack.length - 1]?.node;
  const lastNodeIndex = rs.lastNodes.length - 1;
  const leftNode = rs.lastNodes[lastNodeIndex];

  if (rs.stack.length === 0) {
    rs.siblings.push([descendant]);
  } else {
    hooks.insertDescendant({ parentNode, descendant, leftNode });
  }

  rs.lastNodes[lastNodeIndex] = descendant;
};

const createNode: RenderNode = ({ hooks, rs, integral }) => {
  popSelfClosingNode(rs);

  const tagName = getText(rs.template, integral.tagNameVector);
  if (tagName === undefined) {
    return;
  }

  const parent = rs.stack[rs.stack.length - 1];
  const descendant = hooks.createNode(tagName);

  // get parent node
  const parentNode = parent?.node;

  // add it to rs last nodes
  const lastNodeIndex = rs.lastNodes.length - 1;
  const leftNode = rs.lastNodes[lastNodeIndex];

  // add to silblings when stack is flat
  const isSiblingLevel = rs.stack.length === 0;
  if (isSiblingLevel) {
    rs.siblings.push([descendant]);
  } else {
    hooks.insertDescendant({ parentNode, leftNode, descendant });
  }

  // push to last nodes
  rs.lastNodes[lastNodeIndex] = descendant;
  rs.lastNodes.push(undefined);

  // push to stack
  const selfClosing = integral.kind === "SELF_CLOSING_NODE";
  rs.stack.push({
    kind: "NODE",
    node: descendant,
    selfClosing,
    tagName,
  });
};

const closeNode: RenderCloseNode = ({ hooks, rs, integral }) => {
  if (rs.stack.length === 0) {
    return;
  }

  popSelfClosingNode(rs);

  const tagName = getText(rs.template, integral.tagNameVector);
  const nodeBit = rs.stack[rs.stack.length - 1];
  if (nodeBit.kind !== "NODE") {
    return;
  }

  if (nodeBit.tagName === tagName) {
    rs.stack.pop();
    rs.lastNodes.pop();
  }
};

const createChunkArrayInjection: CreateChunkArrayInjection = ({
  hooks,
  rs,
  integral,
}) => {
  popSelfClosingNode(rs);

  // attach injection as Context
  const parentNode = rs.stack[rs.stack.length - 1]?.node;
  const lastNodeIndex = rs.lastNodes.length - 1;
  const leftNode = rs.lastNodes[lastNodeIndex];
  const injection = rs.template.injections[integral.injectionID];

  const isSiblingLevel = rs.stack.length === 0;
  let siblingIndex;

  // String Injection
  if (!Array.isArray(injection)) {
    // attach injection as content
    const text = String(injection);
    const textNode = hooks.createTextNode(text);

    // push to siblings or stack
    if (rs.stack.length === 0) {
      rs.siblings.push([textNode]);
      siblingIndex = rs.siblings.length - 1;
    } else {
      hooks.insertDescendant({
        descendant: textNode,
        parentNode,
        leftNode,
      });
    }

    rs.descendants[integral.injectionID] = {
      kind: "TEXT",
      params: { textNode, leftNode, parentNode, text, siblingIndex },
    };

    rs.lastNodes[lastNodeIndex] = textNode;
    return;
  }

  // Add Context Siblings

  const siblingsFromContextArray = [];
  let prevSibling = leftNode;

  for (const contextID in injection) {
    const context = injection[contextID];
    const siblings = context.getSiblings();

    // add context siblings
    if (isSiblingLevel) {
      for (const siblingID in siblings) {
        const sibling = siblings[siblingID];
        siblingsFromContextArray.push(sibling);
        // set prev sibling
        prevSibling = sibling;
      }
    } else {
      // set prev sibling
      prevSibling = context.mount(parentNode, prevSibling);
    }
  }

  if (isSiblingLevel) {
    rs.siblings.push(siblingsFromContextArray);
    siblingIndex = rs.siblings.length - 1;
  }

  rs.descendants[integral.injectionID] = {
    kind: "CHUNK_ARRAY",
    params: { chunkArray: injection, leftNode, parentNode, siblingIndex },
  };

  rs.lastNodes[lastNodeIndex] = prevSibling;
};

const appendExplicitAttribute: RenderAppendExplicitAttribute = ({
  hooks,
  rs,
  integral,
}) => {
  const node = rs.stack[rs.stack.length - 1].node;
  const attribute = getText(rs.template, integral.attributeVector);
  if (attribute === undefined) {
    return;
  }

  // get copy of text
  // then decrement
  const valueVector = copy(integral.valueVector);
  incrementOrigin(rs.template, valueVector);
  decrementTarget(rs.template, valueVector);

  const value = getText(rs.template, valueVector);
  if (value === undefined) {
    return;
  }

  hooks.setAttribute({ references: rs.references, node, attribute, value });
};

const appendImplicitAttribute: RenderImplicitAttribute = ({
  hooks,
  rs,
  integral,
}) => {
  if (rs.stack.length === 0) {
    return;
  }

  const { node } = rs.stack[rs.stack.length - 1];

  const attribute = getText(rs.template, integral.attributeVector);
  if (attribute === undefined) {
    return;
  }

  hooks.setAttribute({
    value: true,
    references: rs.references,
    node,
    attribute,
  });
};

const appendInjectedAttribute: RenderInjectedAttribute = ({
  hooks,
  rs,
  integral,
}) => {
  if (rs.stack.length === 0) {
    return;
  }

  const { node } = rs.stack[rs.stack.length - 1];

  const attribute = getText(rs.template, integral.attributeVector);
  if (attribute === undefined) {
    return;
  }

  const { injectionID } = integral;
  const value = rs.template.injections[injectionID];

  // add to injection map
  rs.attributes[injectionID] = {
    kind: "ATTRIBUTE",
    params: { references: rs.references, node, attribute, value },
  };

  hooks.setAttribute({ references: rs.references, node, attribute, value });
};

const buildRender: BuildRender = ({ hooks, template, integrals }) => {
  const rs = {
    template,
    attributes: {},
    references: {},
    descendants: {},
    siblings: [],
    lastNodes: [undefined],
    stack: [],
  };

  for (const integral of integrals) {
    if (integral.kind === "NODE" || integral.kind === "SELF_CLOSING_NODE") {
      createNode({ hooks, rs, integral });
    }
    if (integral.kind === "CLOSE_NODE") {
      closeNode({ hooks, rs, integral });
    }
    if (integral.kind === "TEXT") {
      createTextNode({ hooks, rs, integral });
    }
    if (integral.kind === "CHUNK_ARRAY_INJECTION") {
      createChunkArrayInjection({ hooks, rs, integral });
    }
    if (integral.kind === "EXPLICIT_ATTRIBUTE") {
      appendExplicitAttribute({ hooks, rs, integral });
    }
    if (integral.kind === "IMPLICIT_ATTRIBUTE") {
      appendImplicitAttribute({ hooks, rs, integral });
    }
    if (integral.kind === "INJECTED_ATTRIBUTE") {
      appendInjectedAttribute({ hooks, rs, integral });
    }
  }

  return rs;
};

export {
  appendExplicitAttribute,
  appendImplicitAttribute,
  appendInjectedAttribute,
  buildRender,
  closeNode,
  createChunkArrayInjection,
  createNode,
  createTextNode,
};
