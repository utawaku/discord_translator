import { Client, GatewayIntentBits, Collection } from "discord.js";

import commands from "./commands/index.js";
import events from "./events/index.js";

export function registerClient(TOKEN) {
  const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
  });

  client.commands = commands;
  client.cooldowns = new Collection();

  for (const event of events) {
    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args));
    } else {
      client.on(event.name, (...args) => event.execute(...args));
    }
  }

  client.login(TOKEN);

  return client;
}
