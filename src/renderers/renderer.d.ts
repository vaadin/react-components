export type ParametersExceptFirst<F> = F extends (arg0: any, ...rest: infer R) => any ? R : never;

export type WebComponentRenderer = (root: HTMLElement, ...args: any[]) => void;
