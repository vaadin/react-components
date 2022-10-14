import { exec } from 'child_process';
import { promisify } from 'util';

export const execPromisified = promisify(exec);

export function tagNameToClassName(tagName: string) {
  const parts = tagName.split('-');
  if (parts[0] === 'vaadin') {
    parts.shift();
  }

  // CamelCase join
  return parts.map(part => part.slice(0, 1).toUpperCase() + part.slice(1)).join('');
}
