require("dotenv").config();

const express = require("express");
const { Client, GatewayIntentBits } = require("discord.js");

const app = express();

app.get("/", (req, res) => res.send("Bot is running ✅"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("🌐 Web server running on port " + PORT));

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
});

const VOICE_CHANNELS = [
  { id: "VOICE_ID_1", name: "vc1" },
  { id: "VOICE_ID_2", name: "vc2" },
  { id: "VOICE_ID_3", name: "vc3" },
];

const LIMIT = 25;

async function updateVoiceCounts() {
  try {
    for (const vc of VOICE_CHANNELS) {
      const channel = await client.channels.fetch(vc.id).catch(() => null);
      if (!channel) continue;

      const count = channel.members?.size || 0;
      const newName = `${vc.name} [${count}/${LIMIT}]`;

      if (channel.name === newName) continue;

      await channel.setName(newName);
    }
  } catch (err) {
    console.log("❌ updateVoiceCounts error:", err);
  }
}

client.once("ready", async () => {
  console.log(`✅ BOT ONLINE: ${client.user.tag}`);

  // при старт
  await updateVoiceCounts();

  // на всеки 20 секунди (за всеки случай)
  setInterval(updateVoiceCounts, 20000);
});

// когато някой влезе/излезе от voice
client.on("voiceStateUpdate", async () => {
  await updateVoiceCounts();
});

if (!process.env.TOKEN) {
  console.log("❌ TOKEN липсва! Сложи TOKEN в Render Environment.");
  process.exit(1);
}

client.login(process.env.TOKEN);
