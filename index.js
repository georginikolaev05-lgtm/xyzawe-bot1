const express = require('express');
const app = express();
app.get('/', (req, res) => res.send('XYZAWE BOT ONLINE'));
app.listen(process.env.PORT || 3000);

// DISCORD
const { Client, GatewayIntentBits, ActivityType } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates
  ]
});

const VOICES = [
  { id: '1457014588880060560', name: 'V1' },
  { id: '1401170198345683050', name: 'V2' },
  { id: '1401290382691799202', name: 'V3' }
];

const LIMIT = 25;

function updateStatus() {
  if (!client.user) return;

  const text = VOICES.map(v => {
    const channel = client.channels.cache.get(v.id);
    const count = channel?.members?.size || 0;
    return `${v.name}: ${count}/${LIMIT}`;
  }).join(' | ');

  client.user.setPresence({
    activities: [{
      name: text,
      type: ActivityType.Watching
    }],
    status: 'online'
  });
}

client.once('ready', () => {
  console.log('XYZAWE BOT ONLINE');
  updateStatus();
});

client.on('voiceStateUpdate', updateStatus);

client.login(process.env.TOKEN);
