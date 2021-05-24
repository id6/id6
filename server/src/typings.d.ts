export interface BuildInfo {
  version: string;
  buildDate: Date;
  commitHash: string;
}

declare global {
  const BUILD_INFO: BuildInfo;
  const POSTHOG_API_KEY: string;
}

declare module '*.hbs';
