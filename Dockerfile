FROM node:12.16.1-alpine
MAINTAINER canyuegongzi
ENV HOST 0.0.0.0
RUN mkdir -p /app
COPY ./dist /app
WORKDIR /app
EXPOSE 10001
RUN npm config set registry https://registry.npm.taobao.org && \
    npm install

CMD ["node", "/app/main.js"]
