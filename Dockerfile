# Stage 1: Build the Next.js app
FROM node:18-alpine AS build

WORKDIR /admin-portal

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# Stage 2: Run the Next.js app
FROM node:18-alpine

WORKDIR /admin-portal

COPY --from=build /admin-portal/.next ./.next
COPY --from=build /admin-portal/package.json ./
COPY --from=build /admin-portal/node_modules ./node_modules

EXPOSE 3000

CMD [ "npm", "start" ]
