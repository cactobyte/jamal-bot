const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const { QuickDB } = require('quick.db');
const db = new QuickDB();
const cooldowns = new Map(); 

module.exports = {
	data: new SlashCommandBuilder()
		.setName('work')
		.setDescription('Earn some money by working'),
	async execute(interaction) {
		const userId = interaction.user.id;
		const cooldownTime = 60000; // 60 secs

		if (cooldowns.has(userId)) {
			const expirationTime = cooldowns.get(userId) + cooldownTime;
			if (Date.now() < expirationTime) {
				const timeLeft = (expirationTime - Date.now()) / 1000;
				return interaction.reply({content: `Please wait ${timeLeft.toFixed(1)} more seconds before using this command again.`, ephemeral: true });
			}
		}

		try {
			const earnings = Math.floor(Math.random() * (50 - 10 + 1)) + 10;
			let currentBal = (await db.get(`money_${userId}`)) || 0;
			const newBal = currentBal + earnings;
			await db.set(`money_${userId}`, newBal);

			const workEmbed = new EmbedBuilder()
				.setColor("#fcfcfc")
				.setDescription(`You worked and earned $${earnings}! Your new balance is $${newBal}.`);
			
			await interaction.reply({ embeds: [workEmbed] });

			cooldowns.set(userId, Date.now());
		} catch (error) {
			console.error(`[jamal bot - Error] ${error}`);
			await interaction.reply('There was an error while processing your work command.');
		}
	},
};