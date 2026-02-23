# Book A Meal API - Express v1 (stable)
# Build and run the current Express app for stable frontend deployment

FROM node:16-alpine

WORKDIR /app

# Install OpenSSH for container access
RUN apk add --no-cache openssh \
  && ssh-keygen -A \
  && mkdir -p /run/sshd

# Install dependencies
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production=false

# Copy source and config
COPY . .

# Build app (Babel compiles src/ -> dist/)
RUN yarn build

# SSH: create app user (password: app, change in production)
RUN adduser -D -s /bin/sh app \
  && echo 'app:app' | chpasswd \
  && mkdir -p /home/app/.ssh \
  && chown -R app:app /home/app

COPY docker/sshd_config /etc/ssh/sshd_config
COPY docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 8000 2222
ENV NODE_ENV=production
ENTRYPOINT ["/entrypoint.sh"]
