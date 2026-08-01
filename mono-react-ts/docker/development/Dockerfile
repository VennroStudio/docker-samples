FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json ./
COPY apps/web/package.json apps/web/package.json
COPY apps/admin/package.json apps/admin/package.json
COPY packages/api-client/package.json packages/api-client/package.json
COPY packages/app-runtime/package.json packages/app-runtime/package.json
COPY packages/theme/package.json packages/theme/package.json
COPY packages/ui/package.json packages/ui/package.json
RUN npm ci

EXPOSE 5173
CMD ["npm", "run", "dev", "--workspace=@mono/web", "--", "--host", "0.0.0.0"]
