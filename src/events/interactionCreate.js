import { Collection, Events } from "discord.js";

import { DEFAULT_COOLDOWN } from "../constants.js";

async function handleAutocomplete(interaction) {
  const { commands } = interaction.client;

  const command = commands.get(interaction.commandName);

  if (!command) {
    console.log(`No command matching ${interaction.commandName} found!`);
    return;
  }

  try {
    await command.autocomplete(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: "There was an error while executing this autocomplete!", ephemeral: true });
  }
}

async function handleChatInputCommand(interaction) {
  const { commands, cooldowns } = interaction.client;

  const commandRaw = commands.get(interaction.commandName);

  if (!commandRaw) {
    console.log(`No command matching ${interaction.commandName} found!`);
    return;
  }

  const { command, cooldown, execute } = commandRaw;

  if (!cooldowns.has(command.name)) {
    cooldowns.set(command.name, new Collection());
  }

  const now = Date.now();
  const timestamps = cooldowns.get(command.name);

  const cooldownAmount = (cooldown ?? DEFAULT_COOLDOWN) * 1000;

  if (timestamps.has(interaction.user.id)) {
    const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;

    if (now < expirationTime) {
      const expiredTimestamp = Math.round(expirationTime / 1000);

      return interaction.reply({
        content: `Please wait for command ${command.name}. You can use it again <t:${expiredTimestamp}:R>`,
        ephemeral: true,
      });
    }
  }

  try {
    await execute(interaction);
    timestamps.set(interaction.user.id, now);

    setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    } else {
      await interaction.reply({ content: "There was an error while executing this command!", ephemeral: true });
    }
  }
}

export default {
  name: Events.InteractionCreate,
  once: false,
  execute: async function (interaction) {
    if (interaction.isChatInputCommand()) {
      return await handleChatInputCommand(interaction);
    } else if (interaction.isAutocomplete()) {
      return await handleAutocomplete(interaction);
    }
  },
};
