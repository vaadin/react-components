export class ElementNameMissingError extends Error {
  constructor(packageName: string) {
    super(`[${packageName}]: name is missing in element declaration`);
  }
}

export class ComponentFileMissingError extends Error {
  constructor(packageName: string, name: string) {
    super(`[${packageName}]: ${name} component is not found`);
  }
}

export function warnAboutExistingFile(path: string) {
  console.warn(`[WARNING]: ${path} already exists. If you want to override it, add "--override" key to the command`);
}
