FROM caddy:2

LABEL maintainer="info@id6.io"

RUN apk add --no-cache \
       bash \
       nodejs \
       npm

COPY ./docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

COPY ./ui/build /ui/
COPY ./server/build /server/
COPY ./server/node_modules /server/node_modules
COPY ./docker/Caddyfile /etc/caddy/Caddyfile

ENV NODE_ENV "production"
ENV ID6_POSTHOG_ENABLED "true"
ENV ID6_DATA_DIR "/data"

VOLUME /data

EXPOSE 3000
EXPOSE 3030
EXPOSE 9090

WORKDIR /server
ENTRYPOINT ["/entrypoint.sh"]
CMD ["node", "index.js"]
