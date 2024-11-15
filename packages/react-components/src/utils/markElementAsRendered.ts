const ELEMENT_RENDERED = Symbol();

export function markElementAsRendered(element: HTMLElement & { [ELEMENT_RENDERED]?: boolean }) {
  element[ELEMENT_RENDERED] = true;
}

export function isElementMarkedAsRendered(element: HTMLElement & { [ELEMENT_RENDERED]?: boolean }) {
  return !!element[ELEMENT_RENDERED];
}
