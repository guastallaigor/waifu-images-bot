import Discord from "discord.js";
import axios from "axios";
import dotenv from "dotenv";
import { categories } from "./categories.js";
import emojis from "./emojis.js";
import ImagesCache from "./images-cache.js";
import {
  defaultMessage,
  waifuMessage,
  nsfwBlockMessage,
  errorMessage,
} from "./commands.js";

dotenv.config();

const sendWaifuMessage = async (message, url, categoryName) => {
  const waifu = await message.channel.send(waifuMessage(url, categoryName));
  await waifu.react(emojis.smiley);
  await waifu.react(emojis.thumbsUp);
  await waifu.react(emojis.thumbsDown);
};

const client = new Discord.Client();

client.once("ready", () => {
  console.log("Bot ready...");
  console.log(
    `Bot available in ${
      client && client.guilds && client.guilds.cache && client.guilds.cache.size
    } guilds`
  );
  client.user.setActivity(`type ?help`);
});

client.on("message", async (message) => {
  const prefix = process.env.DISCORD_PREFIX;

  if (!message.content.startsWith(prefix) || message.author.bot) return;

  try {
    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLocaleLowerCase();

    if (command === "help") {
      return message.channel.send(defaultMessage());
    }

    const categoryObject = categories.find((it) => it.command === command);

    if (!categoryObject) return;

    if (!categoryObject.sfw && !message.channel.nsfw) {
      return message.channel.send(nsfwBlockMessage());
    }

    const type = categoryObject.sfw ? "sfw" : "nsfw";
    const category = categoryObject.name;

    if (ImagesCache.hasImages(type, category)) {
      const url = ImagesCache.getImage(type, category);
      await sendWaifuMessage(message, url, category);
      return;
    }

    const instance = axios.create({
      baseURL: "https://waifu.pics/api/many",
      timeout: 1000,
    });
    const { data } = await instance.post(`/${type}/${category}`, {
      exclude: [],
    });

    if (!data || !data.files) return;

    const { files } = data;
    ImagesCache.setImages(type, category, files);
    const url = ImagesCache.getImage(type, category);
    await sendWaifuMessage(message, url, category);
  } catch (err) {
    return message.channel.send(errorMessage());
  }
});

client.login(process.env.DISCORD_TOKEN);
