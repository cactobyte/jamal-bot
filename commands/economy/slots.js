const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ComponentType } = require('discord.js');
const { QuickDB } = require('quick.db');
const db = new QuickDB();

const symbols = ['🍒', '🍋', '🍊', '🍉', '🍆', '🍇', '🍌', '🍟', '🥥', '🍈'];

function spinSlots() {
  return [
    symbols[Math.floor(Math.random() * symbols.length)],
    symbols[Math.floor(Math.random() * symbols.length)],
    symbols[Math.floor(Math.random() * symbols.length)],
  ];
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('slots')
    .setDescription('Play a game of Slots!')
    .addIntegerOption(option =>
        option
            .setName('bet_amount')
            .setDescription('Amount to bet')
            .setRequired(true)),
  async execute(interaction) {
    let betAmountRaw = interaction.options.getInteger('bet_amount');
    let userBalance = (await db.get(`money_${interaction.user.id}`)) || 0;

    let winnings;
    let betAmount;
    let totalBet = 0;
    let netProfit = 0;

    const spinButton = new ButtonBuilder()
        .setCustomId('spin_slots')
        .setLabel('Spin!')
        .setStyle(ButtonStyle.Success);
    const row = new ActionRowBuilder().addComponents(spinButton);
    const initialEmbed = new EmbedBuilder()
        .setColor("#fcfcfc")
        .setTitle("**Slot Machine**")
        .setDescription("Press the button to spin the slots!");

    await interaction.reply({ embeds: [initialEmbed], components: [row] });

    const collector = interaction.channel.createMessageComponentCollector({ componentType: ComponentType.Button, time: 3_600_000 });

    collector.on('collect', async i => {
        if (i.customId === 'spin_slots') {
            const result = spinSlots();
            const resultString = result.join(' '); 

            if (betAmountRaw > userBalance) {
                return await interaction.reply("You don't have enough balance to place this bet!");
            } else {
                betAmount = interaction.options.getInteger('bet_amount');
                totalBet += betAmount;
            }

            if (result[0] === result[1] && result[1] === result[2]) {
                winnings = betAmount * 15; 
                userBalance += winnings; 
                netProfit += winnings;
                await db.set(`money_${interaction.user.id}`, userBalance); 
            } else if (result[0] == result[1] || result [1] == result[2]){
                winnings = betAmount * 3; 
                userBalance += winnings; 
                netProfit += winnings;
                await db.set(`money_${interaction.user.id}`, userBalance);
            } else if (result[0] == result[2]){
                winnings = betAmount * 2; 
                userBalance += winnings; 
                netProfit += winnings;
                await db.set(`money_${interaction.user.id}`, userBalance);
            } else {
                userBalance -= betAmount; 
                netProfit -= betAmount;
                await db.set(`money_${interaction.user.id}`, userBalance);
            }
            
            const spinningEmbed = new EmbedBuilder()
                .setColor("#fcfcfc")
                .setAuthor({name: `${interaction.user.username}'s Slot Machine`,iconURL: interaction.user.displayAvatarURL({ dynamic: true })})
                .setDescription(`**Result:** ${resultString}\n\n` +
                    `**Bet Amount:** $${betAmount}\n` +
                    `**Total Spent:** $${totalBet}\n` +
                    `**Net Winnings:** $${netProfit}\n`)
                .addFields(
                    { name: 'New Balance', value: `$${userBalance}`, inline: true }
                );

            await i.update({ embeds: [spinningEmbed], components: [row] });
        }
    });

    collector.on('end', () => {
        spinButton.setDisabled(true);
        interaction.editReply({ components: [row] });
    });

  },
};