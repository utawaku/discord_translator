import { SlashCommandBuilder } from "discord.js";
import { translate } from "google-translate-api-x";

const LANGS = Object.keys(translate.languages)
  .filter((value) => value !== "auto")
  .sort();

/**
 * Check google translator supported languages
 * @param {string} lang language code
 * @returns boolean true if language exists
 */
function isLangExists(lang) {
  return LANGS.includes(lang);
}

/**
 * Translate text
 * @param {string} text text to translate
 * @param {string} from language code, default is auto
 * @param {string} to language code, default is en
 * @returns {Promise<{ok: true, data: string}> | Promise<{ok: false, error: string}
 */
async function translateText(text, from = "auto", to = "en") {
  if (isLangExists(to) === false) {
    return {
      ok: false,
      error:
        "Language not supported, please check supported language code from [here](https://cloud.google.com/translate/docs/languages)",
    };
  }

  if (from !== "auto" && isLangExists(from) === false) {
    return {
      ok: false,
      error:
        "Language not supported, please check supported language code from [here](https://cloud.google.com/translate/docs/languages)",
    };
  }

  try {
    const res = await translate(text, { from, to });

    return {
      ok: true,
      data: res.text,
    };
  } catch (e) {
    if (e.name === "TooManyRequestsError") {
      return {
        ok: false,
        error: "Too many requests error",
      };
    }
  }
}

export default {
  cooldown: 5,
  command: new SlashCommandBuilder()
    .setName("translate")
    .setDescription(
      "Replies with translated text (https://cloud.google.com/translate/docs/languages)"
    )
    .addStringOption((option) => {
      return option
        .setName("to")
        .setDescription("Language code to translate to")
        .setRequired(true)
        .setAutocomplete(true);
    })
    .addStringOption((option) => {
      return option.setName("text").setDescription("Text to translate").setRequired(true);
    })
    .addStringOption((option) => {
      return option
        .setName("from")
        .setDescription("Language code to translate from")
        .setRequired(false)
        .setAutocomplete(true);
    }),
  async execute(interaction) {
    await interaction.deferReply();

    const from = interaction.options.getString("from") ?? "auto";
    const to = interaction.options.getString("to");
    const text = interaction.options.getString("text");

    const result = await translateText(text, from, to);

    if (result.ok) {
      await interaction.editReply(`from: **${from}**, to: **${to}**, text: \`${text}\``);
      await interaction.followUp(result.data);
    } else {
      await interaction.editReply("Failed to translate text", { ephemeral: true });
      await interaction.followUp(result.error);
    }
  },
  async autocomplete(interaction) {
    const focusedOption = interaction.options.getFocused();

    const filtered = LANGS.filter((lang) => lang.includes(focusedOption))
      .slice(0, 25)
      .map((lang) => {
        return {
          name: lang,
          value: lang,
        };
      });

    await interaction.respond(filtered.slice(0, 25));
  },
};
