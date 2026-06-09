FROM node:22-alpine

LABEL org.opencontainers.image.authors="Mateusz Olszewski"

WORKDIR /app

COPY package*.json ./

RUN npm install --omit=dev \
    && npm cache clean --force

COPY app.js .
COPY views ./views
COPY public ./public

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s \
CMD wget --quiet --tries=1 --spider http://localhost:3000 || exit 1

CMD ["node", "app.js"]