// brian taylor vann
// text position

import type { Template } from "../type_flyweight/template.ts";
import type { Position } from "../type_flyweight/text_vector.ts";

type Create = (position?: Position) => Position;
type Copy = (position: Position) => Position;

type Increment = <N, A>(
  template: Template<N, A>,
  position: Position,
) => Position | undefined;

type GetCharAtPosition = <N, A>(
  template: Template<N, A>,
  position: Position,
) => string | undefined;

const DEFAULT_POSITION: Position = {
  arrayIndex: 0,
  stringIndex: 0,
};

const create: Create = (position = DEFAULT_POSITION) => ({ ...position });

const copy: Copy = (position) => {
  return { ...position };
};

const increment: Increment = (template, position) => {
  const chunk = template.templateArray[position.arrayIndex];
  if (chunk === undefined) {
    return;
  }

  // template boundaries
  const templateLength = template.templateArray.length - 1;
  if (
    position.arrayIndex >= templateLength &&
    position.stringIndex >= chunk.length - 1
  ) {
    return;
  }

  // cannot % modulo by 0
  if (chunk.length > 0) {
    position.stringIndex += 1;
    position.stringIndex %= chunk.length;
  }

  if (position.stringIndex === 0) {
    position.arrayIndex += 1;
  }

  return position;
};

const decrement: Increment = (template, position) => {
  const chunk = template.templateArray[position.arrayIndex];
  if (chunk === undefined) {
    return;
  }

  // template boundaries
  if (position.arrayIndex <= 0 && position.stringIndex <= 0) {
    return;
  }

  position.stringIndex -= 1;
  if (position.arrayIndex > 0 && position.stringIndex < 0) {
    position.arrayIndex -= 1;

    const chunk = template.templateArray[position.arrayIndex];
    position.stringIndex = chunk.length - 1;

    // undefined case akin to divide by zero
    if (chunk === "") {
      position.stringIndex = chunk.length;
    }
  }

  return position;
};

const getCharAtPosition: GetCharAtPosition = (template, position) => {
  return template.templateArray[position.arrayIndex]?.[position.stringIndex];
};

export { copy, create, decrement, getCharAtPosition, increment };
