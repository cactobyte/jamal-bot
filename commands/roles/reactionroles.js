// const { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, SlashCommandBuilder, EmbedBuilder} = require('discord.js');

// module.exports = {
// 	data: new SlashCommandBuilder()
// 		.setName('reaction')
// 		.setDescription('Reaction Roles Menu'),
// 	async execute(interaction) {
//         if (interaction.user.id !== ownerId) {
// 			return await interaction.reply({
// 				content: "You do not have permission to use this command.",
// 				ephemeral: true, // Makes the reply visible only to the user
// 			});
// 		}
// 		const select = new StringSelectMenuBuilder()
// 			.setCustomId('starter')
// 			.setPlaceholder('Make a selection!')
// 			.addOptions(
// 				new StringSelectMenuOptionBuilder()
// 					.setLabel('Bronze')
// 					.setValue('bronze')
//                     .setEmoji("<:Bronze4:1272481122131116065>"),
// 				new StringSelectMenuOptionBuilder()
// 					.setLabel('Silver')
// 					.setValue('silver')
//                     .setEmoji("<:Silver4:1272481181623123988>"),
// 				new StringSelectMenuOptionBuilder()
// 					.setLabel('Gold')
// 					.setValue('gold')
//                     .setEmoji("<:Gold4:1272481430202486876>"),
//                 new StringSelectMenuOptionBuilder()
//                     .setLabel('Platinum')
//                     .setValue('platinum')
//                     .setEmoji("<:Platinum4:1272481163750932491>"),
//                 new StringSelectMenuOptionBuilder()
//                     .setLabel('Emerald')
//                     .setValue('emerald')
//                     .setEmoji("<:Emerald4:1272481142309781555>"),
//                 new StringSelectMenuOptionBuilder()
//                     .setLabel('Ruby')
//                     .setValue('ruby')
//                     .setEmoji("<:Ruby4:1272481334673145876>"),
//                 new StringSelectMenuOptionBuilder()
//                     .setLabel('Diamond')
//                     .setValue('diamond')
//                     .setEmoji("<:Diamond4:1272481131664642160>"),
//                 new StringSelectMenuOptionBuilder()
//                     .setLabel('Champion')
//                     .setValue('champion')
//                     .setEmoji("<:Champion:1272481124165353493>"),
// 			);

// 		const row = new ActionRowBuilder()
// 			.addComponents(select);

// 		await interaction.reply({
// 			content: "fuck off",
// 			components: [row],
// 		});

//         const collector = response.createMessageComponentCollector({ componentType: ComponentType.StringSelect, time: 3_600_000 });

//         collector.on('collect', async i => {
//             const selection = i.values[0];
//             await i.reply(`${i.user} has selected ${selection}!`);
//         });

// 	},
// };