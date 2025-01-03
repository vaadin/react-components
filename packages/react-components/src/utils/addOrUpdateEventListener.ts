const listenedEvents = new WeakMap<Element, Map<string, EventListenerObject>>();

export default function addOrUpdateEventListener(
  node: Element,
  event: string,
  listener: ((event: Event) => void) | undefined,
) {
  let nodeEvents = listenedEvents.get(node);
  if (nodeEvents === undefined) {
    nodeEvents = new Map();
    listenedEvents.set(node, nodeEvents);
  }

  let handler = nodeEvents.get(event);
  if (listener !== undefined) {
    if (handler === undefined) {
      // If necessary, add listener and track handler
      handler = { handleEvent: listener };
      node.addEventListener(event, handler);
      nodeEvents.set(event, handler);
    } else {
      // Otherwise just update the listener with new value
      handler.handleEvent = listener;
    }
  } else if (handler !== undefined) {
    // Remove listener if one exists and value is undefined
    node.removeEventListener(event, handler);
    nodeEvents.delete(event);
  }
}
