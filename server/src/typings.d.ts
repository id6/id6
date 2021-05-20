export interface BuildInfo {
  version: string;
  buildDate: Date;
  commitHash: string;
}

declare global {
  const BUILD_INFO: BuildInfo;
}

declare module '*.hbs';
