const ELEMENT_RENDERED = Symbol();

export function markElementAsRendered(element: HTMLElement) {
  element[ELEMENT_RENDERED] = true;
}

export function isElementMarkedAsRendered(element: HTMLElement) {
  return element[ELEMENT_RENDERED];
}
