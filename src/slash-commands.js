import { Routes } from "discord.js";
import { REST } from "discord.js";
import commands from "./commands/index.js";

export async function registerSlashCommands(token, clientId, guildId) {
  const rest = new REST().setToken(token);

  try {
    console.log("Started refreshing application (/) commands.");

    const data = await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
      body: commands.map((command) => command.command.toJSON()),
    });

    console.log("Successfully reloaded application (/) commands.", data);
  } catch (error) {
    console.error(error);
  }
}
