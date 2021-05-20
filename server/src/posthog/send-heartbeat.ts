import { postHog, postHogId } from './posthog';

export function sendHeartbeat() {
  postHog.capture({
    event: 'heartbeat',
    distinctId: postHogId.id,
    properties: {
      version: BUILD_INFO.version,
    },
  });
}
