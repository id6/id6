<p align="center">
  <a href="https://id6.io">
    <img alt="id6-logo" src="https://raw.githubusercontent.com/id6/id6-brand/latest/logo/id6-logo-purple.svg" width="100"/>
  </a>
</p>
<h1 align="center">id6</h1>
<p align="center">Authentication and authorization as a service</p>
<p align="center">
    <a href="https://docs.id6.io">Docs</a> - <a href="https://twitter.com/id6io">Twitter</a>
</p>

## Why id6 ?

I wrote id6 out of frustration of re-writing authentication and authorization over and over again. It is distributed as a Docker container
and meant to be run as a container alongside your application, handling authentication and authorization as a service.

In short, it features the following:

- easy to deploy with Docker
- simple integration in frontend and backend frameworks using our SDKs
- natively supports email/password authentication
- supports many authentication methods through PassportJS (feel free to add those you need)
- dynamically enabled authentication methods
- customizable branding

## Development

```
docker-compose -f ./docker-compose-dev.yml up -d
npm i
npm start
```

## Adding new auth methods

1. Add an auth strategy in `server/src/authentication/passport/strategies`.
1. Add an entry for loading your strategy's configuration in
   the [config adapter](`server/src/authentication/passport/config-adapters/env/env-adapter.ts`).
