import { Client, Intents } from "discord.js";
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

const sendWaifuMessage = async (channel, url, categoryName) => {
  const message = await channel.send({
    embeds: [waifuMessage(url, categoryName)],
    files: [url],
  });
  await Promise.allSettled([
    message.react(emojis.smiley),
    message.react(emojis.thumbsUp),
    message.react(emojis.thumbsDown),
  ]);
};

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.GUILD_MESSAGE_TYPING,
  ],
});

client.once("ready", () => {
  console.log("Bot ready...");
  console.log(
    `Bot available in ${
      client && client.guilds && client.guilds.cache && client.guilds.cache.size
    } guilds`
  );
  client.user.setActivity(`type ?help`);
});

client.on("messageCreate", async ({ channel, author, content }) => {
  const prefix = process.env.DISCORD_PREFIX;

  if (!content.startsWith(prefix) || author.bot) return;

  try {
    const args = content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLocaleLowerCase();

    if (command === "help") {
      return channel.send({
        embeds: [defaultMessage()],
        files: ["./img/rem.jpg"],
      });
    }

    const categoryObject = categories.find((it) => it.command === command);
    if (!categoryObject) return;

    if (!categoryObject.sfw && !channel.nsfw) {
      return channel.send({
        embeds: [nsfwBlockMessage()],
        files: ["./img/kimochiwarui.jpg"],
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
      return sendWaifuMessage(channel, url, category);
    }

    const response = await Http.instance.post(`/${type}/${category}`, {
      exclude: [],
    });
    const data = response?.data;

    if (!data || !data.files) return;

    const { files } = data;
    ImagesCache.setImages(key, files);
    const url = ImagesCache.getImage(key);
    return sendWaifuMessage(channel, url, category);
  } catch (err) {
    return channel.send({ embeds: [errorMessage()], files: ["./img/sad.gif"] });
  }
});

client.login(process.env.DISCORD_TOKEN);
