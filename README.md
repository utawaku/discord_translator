# Discord Translator

## Project setup

### Requirements

[node.js](https://nodejs.org/) is required (or other javascript runtime such as [Bun](https://bun.sh/) or [deno](https://deno.com/) if you know what you are doing)

### Get Project

clone this project using git

```sh
git clone https://github.com/utawaku/discord_translator.git
cd discord_translator
```

### Install Dependencies

install dependencies using npm

```sh
npm i
```

### Set Environment Variables

following environment variables are required

```text
TOKEN=
CLIENT_ID=
GUILD_ID=
```

create `.env` file in project root directory

```text
/discord_translator
-- src
-- .env
-- .gitignore
-- package-lock.json
-- ...
```

then copy paste required env variables

## Run project

run project using node.js

```sh
node --env-file=.env src/index.js
```
