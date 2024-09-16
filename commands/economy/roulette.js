const { EmbedBuilder,  SlashCommandBuilder, Embed} = require('discord.js');
const { QuickDB } = require("quick.db");
const db = new QuickDB();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('roulette')
		.setDescription('Play roulette')
		.addIntegerOption(option =>
			option
				.setName('bet_amount')
				.setDescription('Amount to bet')
				.setRequired(true))
		.addStringOption(option =>
			option
				.setName('bet_on')
				.setDescription('Bet on a number (0-36) or color (Red/Black)')
				.setRequired(true)),
	async execute(interaction) {
		try {
			const betAmountInput = interaction.options.getInteger('bet_amount');
			const betOn = interaction.options.getString('bet_on').toLowerCase();
			const userId = interaction.user.id;

			let userBalance = (await db.get(`money_${userId}`)) || 0;
			let betAmount;

			if (betAmountInput === null || betAmountInput === 0) {
				betAmount = userBalance;
			} else {
				betAmount = betAmountInput;
			}

			if (betAmount > userBalance) {
				return await interaction.reply("You don't have enough balance to place this bet!");
			}

			const spinningEmbed = new EmbedBuilder()
				.setColor("#fcfcfc")
				.setDescription("Spinning...");
			const replyMessage = await interaction.reply({ embeds: [spinningEmbed], fetchReply: true });

			setTimeout(async () => {
				const resultNumber = Math.floor(Math.random() * 37); 
				const resultColor = (resultNumber === 0) ? "green" : (resultNumber % 2 === 0) ? "black" : "red";

				let winnings = 0;
				if (betOn === resultColor || (betOn === resultNumber.toString() && resultNumber !== 0)) {
					winnings = betAmount * (betOn === resultColor ? 2 : 36); // 2x for color, 36x for number
					userBalance += winnings;
					await db.set(`money_${userId}`, userBalance);
				} else {
					userBalance -= betAmount; 
					await db.set(`money_${userId}`, userBalance);
				}

				const resultEmbed = new EmbedBuilder()
					.setColor(resultColor === "red" ? "#FF0000" : resultColor === "black" ? "#000000" : "#00FF00")
					.setDescription(`The result is: **${resultNumber}** (${resultColor})\n` +
						`${interaction.user.username} ${winnings > 0 ? `won $${winnings}!` : `lost $${betAmount}.`}`);
                        
				await replyMessage.edit({ embeds: [resultEmbed] });
                console.log(`[jamal bot] Roulette Wheel Spun by ${interaction.user.username}`);
			}, 2000);

		} catch (error) {
			console.error(`[roulette command] ERROR: ${error}`);
			await interaction.reply('There was an error processing your roulette command.');
		}
	},
};