import { Prometheus } from '@promster/express';
import { env } from '../../env/env';
import { User } from '../../db/entities/user';

const counter = new Prometheus.Gauge({
  name: `${env.ID6_PROMETHEUS_METRICS_PREFIX}user_count`,
  help: 'Total number of users',
});

export function userCount(): Promise<void> {
  return User
    .count()
    .then(res => {
      counter.set(res);
    });
}
