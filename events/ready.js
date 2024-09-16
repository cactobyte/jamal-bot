const { Events, ActivityType  } = require('discord.js');

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		console.log(`[jamal bot] Ready! Logged in as ${client.user.tag}`);
		client.user.setActivity('you gamble', { type: ActivityType.Watching });
	},
};