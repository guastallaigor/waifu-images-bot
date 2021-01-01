import Discord from "discord.js";
import axios from "axios";
import dotenv from "dotenv";
import { categories } from "./categories.js";
import emojis from "./emojis.js";

import { defaultMessage, waifuMessage } from "./commands.js";

dotenv.config();

const client = new Discord.Client();

client.once("ready", () => {
  console.log("Bot ready...");
  console.log(
    `Bot available in ${
      client && client.guilds && client.guilds.cache && client.guilds.cache.size
    } guilds`
  );
  client.user.setActivity(`type !help`);
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

    const instance = axios.create({
      baseURL: "https://waifu.pics/api",
      timeout: 1000,
    });
    const typeURL = categoryObject.sfw ? "sfw" : "nsfw";
    const { data } = await instance.get(`/${typeURL}/${categoryObject.name}`);

    if (!data || !data.url) return;

    const { url } = data;
    const waifu = await message.channel.send(
      waifuMessage(url, categoryObject.name)
    );
    await waifu.react(emojis.smiley);
    await waifu.react(emojis.thumbsUp);
    await waifu.react(emojis.thumbsDown);
  } catch (err) {
    console.log(err);
  }
});

client.login(process.env.DISCORD_TOKEN);
