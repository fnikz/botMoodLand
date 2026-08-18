const { SlashCommandBuilder, MessageFlags, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('guildedit')
		.setDescription('Edit guild sheet fields')
		.addStringOption(option =>
			option.setName('field')
				.setDescription('Field to edit')
				.setRequired(true)
				.addChoices(
					{ name: 'Description', value: 'Description' },
					{ name: 'Recrutement', value: 'Recrutement' },
					{ name: 'Base principale', value: 'Base principale' },
					{ name: 'Avant-poste', value: 'Avant-poste' },
					{ name: 'Objectifs', value: 'Objectifs' }
				))
		.addStringOption(option =>
			option.setName('content')
				.setDescription('New content for the field')
				.setRequired(true)),
	async execute(interaction) {
		// Check if command is used in a guild channel
		if (!interaction.channel) {
			return interaction.reply({
				content: 'This command can only be used in a guild channel.',
				flags: MessageFlags.Ephemeral
			});
		}

		// Get channel topic and verify it starts with JEWORLD_GUILD:
		const topic = interaction.channel.topic || '';
		if (!topic.startsWith('JEWORLD_GUILD:')) {
			return interaction.reply({
				content: 'This channel is not configured as a guild sheet channel.',
				flags: MessageFlags.Ephemeral
			});
		}

		// Extract creator ID from topic (format: JEWORLD_GUILD:creatorID)
		const creatorId = topic.split(':')[1]?.trim();
		if (!creatorId) {
			return interaction.reply({
				content: 'Guild creator ID not found in channel topic.',
				flags: MessageFlags.Ephemeral
			});
		}

		// Check if user is the creator
		if (interaction.user.id !== creatorId) {
			return interaction.reply({
				content: 'Only the guild creator can edit this sheet.',
				flags: MessageFlags.Ephemeral
			});
		}

		const field = interaction.options.getString('field');
		const content = interaction.options.getString('content');

		// Defer the reply to give time to fetch messages
		await interaction.deferReply({ ephemeral: true });

		try {
			// Find the message with the guild sheet embed
			let targetMessage = null;
			let messages = await interaction.channel.messages.fetch({ limit: 100 });

			for (const [, message] of messages) {
				if (message.embeds.length > 0) {
					const embed = message.embeds[0];
					const footer = embed.footer?.text || '';
					if (footer === 'JeWorld • Fiche Guilde' || footer === 'JeWorld • Espace Solo') {
						targetMessage = message;
						break;
					}
				}
			}

			if (!targetMessage) {
				return interaction.editReply({
					content: 'Could not find the guild sheet embed in this channel.'
				});
			}

			// Get the current embed and modify it
			const originalEmbed = targetMessage.embeds[0];
			const newEmbed = EmbedBuilder.from(originalEmbed);

			// Update the specified field
			const fields = newEmbed.data.fields || [];
			let fieldFound = false;

			for (let i = 0; i < fields.length; i++) {
				if (fields[i].name === field) {
					fields[i].value = content;
					fieldFound = true;
					break;
				}
			}

			// If field doesn't exist, add it
			if (!fieldFound) {
				newEmbed.addFields({ name: field, value: content, inline: false });
			} else {
				newEmbed.setFields(fields);
			}

			// Edit the message with the updated embed
			await targetMessage.edit({ embeds: [newEmbed] });

			return interaction.editReply({
				content: `✅ Field "${field}" has been updated successfully.`
			});
		} catch (error) {
			console.error('Error updating guild sheet:', error);
			return interaction.editReply({
				content: 'An error occurred while updating the guild sheet.'
			});
		}
	}
};
