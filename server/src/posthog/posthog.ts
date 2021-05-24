import PostHog from 'posthog-node';

export const postHog = new PostHog(
  POSTHOG_API_KEY || 'changeMe',
  { host: 'https://posthog.id6.io' },
);

export const postHogId = {
  id: undefined,
};
