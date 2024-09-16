const { EmbedBuilder,  SlashCommandBuilder, Embed} = require('discord.js');
const { QuickDB } = require("quick.db");
const db = new QuickDB();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('bal')
		.setDescription('Replies with balance')
        .addUserOption(option =>
			option
				.setName('user')
				.setDescription('Whose balance you want to check')),
	async execute(interaction) {
        try {
            let target = interaction.options.getUser("user") || interaction.user;
			const bal = (await db.get(`money_${target.id}`)) || 0;
			console.log(`[jamal bot] Database Accessed by ${interaction.user.username} ID: ${interaction.user.id}`);

			const balbed = new EmbedBuilder()
				.setColor("#fcfcfc")
				.setDescription(`${target.username} has $${bal}`);
			await interaction.reply({ embeds: [balbed] });
		} catch (error) {
			console.error(`[jamal bot] ERROR: ${error}`);
			await interaction.reply('There was an error retrieving the balance.');
		}
        
	},
};