import { path } from "app-root-path";
import { join } from "path";

function getFunctionPath(pathFromFunctionsDir: string) {
  return join(path, `dist/functions/${pathFromFunctionsDir}`);
}

function fromRoot(r: string) {
  return join(path, r);
}

export { getFunctionPath, fromRoot };
