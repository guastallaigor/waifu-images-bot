import { EmbedBuilder } from "discord.js";
import { categories } from "./categories.js";
import emojis from "./emojis.js";

const capitalize = (s) => {
  if (typeof s !== "string") return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
};

export const defaultMessage = () => {
  let categoryReturn = "";
  let firstNSFW = true;
  return new EmbedBuilder()
    .setTitle("Hello!")
    .setColor("#A1C9F7")
    .setAuthor({ name: "Waifu Images Bot", url: "https://ik.imagekit.io/6xhf1gnexgdgk/rem-avatar_UW2Fsd4Zo.png" })
    .addFields(
      { name: "Available commands", value: 'Available commands' },
      categories
        .map((category) => {
          categoryReturn = `?${category.command}`;

          if (!category.sfw && firstNSFW) {
            categoryReturn = `\n?${category.command}`;
            firstNSFW = false;
          }

          return categoryReturn;
        }),
        { name: "Get a random cute waifu image everytime you type a command!", value: "Get a random cute waifu image everytime you type a command!" },
        { name: `${emojis.smiley} Add WaifuBot to your server ${process.env.DISCORD_LINK}`, value: `${emojis.smiley} Add WaifuBot to your server ${process.env.DISCORD_LINK}` }
    );
};

export const waifuMessage = (url, name) => {
  return new EmbedBuilder()
    .setColor("#A1C9F7")
    .setThumbnail(url)
    .setAuthor({ name: "Waifu Images Bot", url: "https://ik.imagekit.io/6xhf1gnexgdgk/rem-avatar_UW2Fsd4Zo.png" })
    .setTitle(capitalize(name))
    .addFields({ name: `What did you think of this waifu?`, value: `Add your reactions below!` });
};

export const nsfwBlockMessage = () => {
  return new EmbedBuilder()
    .setColor("#EF4444")
    .setAuthor({ name: "Waifu Images Bot", url: "https://ik.imagekit.io/6xhf1gnexgdgk/rem-avatar_UW2Fsd4Zo.png" })
    .addFields({ name: `You're not allowed to use NSFW commands in this channel  ${emojis.sad}`, value: `This channel is SFW` });
};

export const errorMessage = () => {
  return new EmbedBuilder()
    .setColor("#EF4444")
    .setAuthor({ name: "Waifu Images Bot", url: "https://ik.imagekit.io/6xhf1gnexgdgk/rem-avatar_UW2Fsd4Zo.png" })
    .addFields({ name: `Something went wrong with your command  ${emojis.sad}`, value: `You may be able to try again` });
};
