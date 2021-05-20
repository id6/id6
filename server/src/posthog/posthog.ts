import PostHog from 'posthog-node';

export const postHog = new PostHog(
  'changeMe',
  { host: 'https://posthog.id6.io' },
);

export const postHogId = {
  id: undefined,
};
