ARG APP_NAME=web

FROM node:22-alpine AS build

ARG APP_NAME

WORKDIR /app

COPY package.json package-lock.json ./
COPY apps/web/package.json apps/web/package.json
COPY apps/admin/package.json apps/admin/package.json
COPY packages/api-client/package.json packages/api-client/package.json
COPY packages/app-runtime/package.json packages/app-runtime/package.json
COPY packages/theme/package.json packages/theme/package.json
COPY packages/ui/package.json packages/ui/package.json
RUN npm ci

COPY . .
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}
RUN case "$APP_NAME" in \
      web|admin) npm run "build:${APP_NAME}" ;; \
      *) echo "Unsupported APP_NAME=${APP_NAME}" >&2; exit 1 ;; \
    esac

FROM nginx:stable-alpine

ARG APP_NAME=web

COPY --from=build /app/apps/${APP_NAME}/dist /usr/share/nginx/html
COPY docker/production/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
