import { registerSlashCommands } from "./slash-commands.js";
import { registerClient } from "./client.js";

const { TOKEN, CLIENT_ID, GUILD_ID } = process.env;

function main() {
  registerClient(TOKEN);
  registerSlashCommands(TOKEN, CLIENT_ID, GUILD_ID);
}

main();
