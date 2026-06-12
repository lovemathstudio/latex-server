FROM node:18-bullseye

RUN apt-get update && apt-get install -y \
    texlive-full \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json .
RUN npm install

COPY server.js .

EXPOSE 3001

CMD ["node", "server.js"]
