const { MessageActionRow, MessageButton, SlashCommandBuilder } = require('discord.js');
const ytdl = require('ytdl-core');
const { joinVoiceChannel, createAudioPlayer, createAudioResource } = require('@discordjs/voice');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('play music')
        .addStringOption(option =>
			option
				.setName('url')
				.setDescription('url of youtube music')
                .setRequired(true)),
	async execute(interaction) {
        if (!interaction.member.voice.channel) {
            await interaction.reply('You must be in a voice channel to play audio');
            return;
        }

        const voiceChannel = interaction.member.voice.channel;
        const connection = joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: interaction.guildId,
            adapterCreator: interaction.guild.voiceAdapterCreator,
        });

        const url = interaction.options.getString('url');
        const audioResource = createAudioResource(ytdl(url));
        const player = createAudioPlayer();

        player.play(audioResource);
        connection.subscribe(player);

        interaction.reply('Playing: ' + url);
        
	},
};