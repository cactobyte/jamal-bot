const { EmbedBuilder,  SlashCommandBuilder, Embed} = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with bot latency.'),
	async execute(interaction) {
        const botLatency = Date.now() - interaction.createdTimestamp;
        const pingu = new EmbedBuilder()
            .setColor("#fcfcfc")
            .setDescription("🕒 " + botLatency + " ms");
        await interaction.reply({ embeds: [pingu], ephemeral: true });
	},
};