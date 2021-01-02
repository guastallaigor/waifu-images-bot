import Discord from "discord.js";
import { categories } from "./categories.js";
import emojis from "./emojis.js";

const capitalize = (s) => {
  if (typeof s !== "string") return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
};

export const defaultMessage = () => {
  let categoryReturn = "";
  let firstNSFW = true;
  return new Discord.MessageEmbed()
    .setColor("#A1C9F7")
    .attachFiles(["./img/rem.jpg"])
    .setAuthor(
      "Waifu Images Bot",
      "https://ik.imagekit.io/6xhf1gnexgdgk/rem-avatar_UW2Fsd4Zo.png"
    )
    .addField(
      "Available commands:",
      `${categories
        .map((category) => {
          categoryReturn = `?${category.command}`;

          if (!category.sfw && firstNSFW) {
            categoryReturn = `\n?${category.command}`;
            firstNSFW = false;
          }

          return categoryReturn;
        })
        .join(
          "\n"
        )}\n\nGet a random cute waifu image everytime you type a command!        
        \n\n${emojis.smiley}\t[Add WaifuBot to your server](${
        process.env.DISCORD_LINK
      } 'just do it :)')\t${emojis.smiley}`,
      true
    );
};

export const waifuMessage = (url, name) => {
  return new Discord.MessageEmbed()
    .setColor("#A1C9F7")
    .attachFiles([url])
    .setThumbnail(url)
    .setAuthor(
      "Waifu Images Bot",
      "https://ik.imagekit.io/6xhf1gnexgdgk/rem-avatar_UW2Fsd4Zo.png"
    )
    .setTitle(capitalize(name))
    .addField(`What did you think of this waifu?`, `Add your reactions below!`);
};

export const nsfwBlockMessage = () => {
  return new Discord.MessageEmbed()
    .setColor("#EF4444")
    .attachFiles(["./img/kimochiwarui.jpg"])
    .setAuthor(
      "Waifu Images Bot",
      "https://ik.imagekit.io/6xhf1gnexgdgk/rem-avatar_UW2Fsd4Zo.png"
    )
    .addField(
      `You're not allowed to use NSFW commands in this channel  ${emojis.sad}`,
      `This channel is SFW`
    );
};

export const errorMessage = () => {
  return new Discord.MessageEmbed()
    .setColor("#EF4444")
    .attachFiles(["./img/sad.gif"])
    .setAuthor(
      "Waifu Images Bot",
      "https://ik.imagekit.io/6xhf1gnexgdgk/rem-avatar_UW2Fsd4Zo.png"
    )
    .addField(
      `Something went wrong with your command  ${emojis.sad}`,
      `You may be able to try again`
    );
};
