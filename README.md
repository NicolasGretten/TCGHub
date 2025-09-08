# TCGHub

## Installation

### Launch websocket, mongodb and rabbitMq
```shell
git clone https://github.com/NicolasGretten/TCGHub
```

```shell
docker compose up -d --build
```

### Install globally pnpm
```shell
npm i -g pnpm
```

### Install dependency and launch cardmarket scrapper
```shell
cd carmarketScrapper
```

```shell
pnpm i
```

```shell
pnpm dev
```

### Install dependency and launch Inventory API

```shell
cd inventory
```

```shell
pnpm i
```

```shell
pnpm dev
```