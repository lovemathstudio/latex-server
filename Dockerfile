FROM blang/latex:ubuntu

RUN apt-get update && apt-get install -y \
    nodejs \
    npm \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json .
RUN npm install

COPY server.js .

EXPOSE 3001

CMD ["node", "server.js"]
