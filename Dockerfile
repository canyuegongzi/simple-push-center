FROM ubuntu
MAINTAINER canyuegongzi
ENV HOST 0.0.0.0
RUN mkdir -p /app
COPY .. /app
WORKDIR /app
EXPOSE 10001
RUN apt-get update && \
    apt-get install redis-server && \
    npm config set registry https://registry.npm.taobao.org && \
    npm install && \
    npm install pm2 -g
CMD ["sh", "-c", "redis-server && pm2-runtime start ecosystem.config.js"]
