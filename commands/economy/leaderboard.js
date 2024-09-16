const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const { QuickDB } = require("quick.db");
const db = new QuickDB();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('leaderboard')
		.setDescription('Displays the top richest users in the world'),
	async execute(interaction) {
		try {
			const allBalances = await db.all(); 
			const balances = allBalances.filter(entry => entry.id.startsWith('money_')); 

			const userBalances = balances.map(entry => {
				const userId = entry.id.split('_')[1]; 
				return { userId, balance: entry.value }; 
			});

			userBalances.sort((a, b) => b.balance - a.balance);

			const leaderboardEmbed = new EmbedBuilder()
				.setColor("#fcfcfc")
				.setTitle("🏆 Leaderboard: Richest Users")
				.setDescription("Top users by balance in the world:");

			for (let i = 0; i < Math.min(10, userBalances.length); i++) {
				const userId = userBalances[i].userId;
				const balance = userBalances[i].balance;
				const user = await interaction.client.users.fetch(userId); // Fetch user by ID
				leaderboardEmbed.addFields({ name: `${i + 1}. ${user.username}`, value: `$${balance}`, inline: true });
			}

			await interaction.reply({ embeds: [leaderboardEmbed] });

		} catch (error) {
			console.error(`[jamal bot] ERROR: ${error}`);
			await interaction.reply('There was an error retrieving the leaderboard.');
		}
	},
};
