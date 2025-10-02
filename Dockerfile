# syntax=docker/dockerfile:1

# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/go/dockerfile-reference/

# Want to help us make this template better? Share your feedback here: https://forms.gle/ybq9Krt8jtBL3iCk7

ARG NODE_VERSION=23.9.0

FROM node:${NODE_VERSION}-alpine

# Use production node environment by default.
ENV NODE_ENV production


WORKDIR /usr/src/app

# # Download dependencies as a separate step to take advantage of Docker's caching.
# # Leverage a cache mount to /root/.npm to speed up subsequent builds.
# # Leverage a bind mounts to package.json and package-lock.json to avoid having to copy them into
# # into this layer.
# RUN --mount=type=bind,source=package.json,target=package.json \
#     --mount=type=bind,source=package-lock.json,target=package-lock.json \
#     --mount=type=cache,target=/root/.npm \
#     npm ci --omit=dev

RUN npm install -g pnpm

COPY package.json .
RUN pnpm install

RUN mkdir node_modules/.vite/ && chmod -R 777 node_modules/.vite/

# Run the application as a non-root user.
USER node


# # Copy the rest of the source files into the image.
# COPY . .
COPY --chown=node:node . /usr/src/app/

# Expose the port that the application listens on.
EXPOSE 5173
EXPOSE 8081
EXPOSE 8082

##RUN mkdir -p node_modules/.cache && chmod -R 777 node_modules/.cache

# Run the application.
CMD pnpm run dev