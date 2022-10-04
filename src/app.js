import { Client, GatewayIntentBits, REST, Routes, AttachmentBuilder } from "discord.js";
import dotenv from "dotenv";
import { categories } from "./categories.js";
import emojis from "./emojis.js";
import ImagesCache from "./images-cache.js";
import Http from "./http.js";
import {
  defaultMessage,
  waifuMessage,
  nsfwBlockMessage,
  errorMessage,
} from "./commands.js";

dotenv.config();

const sendWaifuMessage = async (interaction, url, categoryName) => {
  const message = await interaction.channel.send({
    embeds: [waifuMessage(url, categoryName)],
    files: [new AttachmentBuilder(url)],
  });
  await Promise.allSettled([
    message.react(emojis.smiley),
    message.react(emojis.thumbsUp),
    message.react(emojis.thumbsDown),
  ]);
};

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    const commands = categories.map(category => ({ name: category.command, description: category.description }));
    await rest.put(Routes.applicationCommands(process.env.DISCORD_APP_ID, ''), { body: commands });

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error, ":error");
  }
})();


const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
  ],
});

client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
  console.log("Bot ready...");
  console.log(
    `Bot available in ${
      client && client.guilds && client.guilds.cache && client.guilds.cache.size
    } guilds`
  );
  client.user.setActivity(`type /help`);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  try {
    const { commandName } = interaction;

    if (commandName === "help") {
      return interaction.channel.send({
        embeds: [defaultMessage()],
        files: [new AttachmentBuilder("./img/rem.jpg")],
      });
    }

    const categoryObject = categories.find((it) => it.command === commandName);
    if (!categoryObject) return;

    if (!categoryObject.sfw && !interaction.nsfw) {
      return interaction.channel.send({
        embeds: [nsfwBlockMessage()],
        files: [new AttachmentBuilder("./img/kimochiwarui.jpg")],
      });
    }

    const type = categoryObject.sfw ? "sfw" : "nsfw";
    const category = categoryObject.name;
    const payload = {
      type,
      category,
    };
    const keyName = ImagesCache.composeKey(payload);
    let key = ImagesCache.keys.get(keyName);

    if (!key) {
      key = ImagesCache.addKey(payload);
    }

    if (ImagesCache.hasImages(key)) {
      const url = ImagesCache.getImage(key);
      return sendWaifuMessage(interaction, url, category);
    }

    const response = await Http.instance.post(`/${type}/${category}`, {
      exclude: [],
    });
    const data = response?.data;

    if (!data || !data.files) return;

    const { files } = data;
    ImagesCache.setImages(key, files);
    const url = ImagesCache.getImage(key);
    return sendWaifuMessage(interaction, url, category);
  } catch (err) {
    console.log(err, ':error');
    return interaction.channel.send({ embeds: [errorMessage()], files: [new AttachmentBuilder("./img/sad.gif")] });
  }
});

client.login(process.env.DISCORD_TOKEN);
