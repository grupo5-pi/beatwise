FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
COPY src ./src
COPY public ./public
ENV NODE_ENV=production
ENV AMBIENTE_PROCESSO=producao
EXPOSE 3333
CMD ["node", "app.js"]