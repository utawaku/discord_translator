import { registerSlashCommands } from "./slash-commands.js";
import { registerClient } from "./client.js";

const { TOKEN, CLIENT_ID, GUILD_ID } = process.env;

function main() {
  try {
    registerClient(TOKEN);
    registerSlashCommands(TOKEN, CLIENT_ID, GUILD_ID);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

main();
