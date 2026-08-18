const { SlashCommandBuilder, MessageFlags, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('guildedit')
		.setDescription('Modifier les champs de la fiche guilde')
		.addStringOption(option =>
			option.setName('champ')
				.setDescription('Champ à modifier')
				.setRequired(true)
				.addChoices(
					{ name: 'Description', value: 'description' },
					{ name: 'Recrutement', value: 'recrutement' },
					{ name: 'Base principale', value: 'baseprincipale' },
					{ name: 'Avant-poste', value: 'avantposte' },
					{ name: 'Objectifs', value: 'objectifs' }
				))
		.addStringOption(option =>
			option.setName('valeur')
				.setDescription('Nouvelle valeur du champ')
				.setRequired(true)),
	async execute(interaction) {
		// Vérifier que la commande est utilisée dans un channel guild
		if (!interaction.channel) {
			return interaction.reply({
				content: 'Cette commande ne peut être utilisée que dans un channel de guilde.',
				flags: MessageFlags.Ephemeral
			});
		}

		// Récupérer le topic du channel et vérifier qu'il commence par JEWORLD_GUILD:
		const topic = interaction.channel.topic || '';
		if (!topic.startsWith('JEWORLD_GUILD:')) {
			return interaction.reply({
				content: 'Ce channel n\'est pas configuré comme channel de fiche guilde.',
				flags: MessageFlags.Ephemeral
			});
		}

		// Extraire l'ID du créateur du topic (format: JEWORLD_GUILD:creatorID)
		const creatorId = topic.split(':')[1]?.trim();
		if (!creatorId) {
			return interaction.reply({
				content: 'L\'ID du créateur de la guilde n\'a pas été trouvé dans le topic.',
				flags: MessageFlags.Ephemeral
			});
		}

		// Vérifier que l'utilisateur est le créateur
		if (interaction.user.id !== creatorId) {
			return interaction.reply({
				content: 'Seul le créateur de la guilde peut modifier cette fiche.',
				flags: MessageFlags.Ephemeral
			});
		}

		const champ = interaction.options.getString('champ');
		const valeur = interaction.options.getString('valeur');

		// Déterminer le nom du champ réel et s'il est inline
		const fieldMapping = {
			description: { name: '📝 Description', inline: false },
			recrutement: { inline: false },
			baseprincipale: { name: '📍 Base principale', inline: true },
			avantposte: { name: '📍 Avant-poste', inline: true },
			objectifs: { name: '🎯 Objectifs', inline: false }
		};

		// Différer la réponse pour avoir le temps de récupérer les messages
		await interaction.deferReply({ ephemeral: true });

		try {
			// Chercher le message avec la fiche guilde
			let targetMessage = null;
			let embedFooter = null;
			let messages = await interaction.channel.messages.fetch({ limit: 100 });

			for (const [, message] of messages) {
				if (message.embeds.length > 0) {
					const embed = message.embeds[0];
					const footer = embed.footer?.text || '';
					if (footer === 'JeWorld • Fiche Guilde' || footer === 'JeWorld • Espace Solo') {
						targetMessage = message;
						embedFooter = footer;
						break;
					}
				}
			}

			if (!targetMessage) {
				return interaction.editReply({
					content: 'Impossible de trouver la fiche guilde dans ce channel.'
				});
			}

			// Récupérer l'embed courant et le modifier
			const originalEmbed = targetMessage.embeds[0];
			const newEmbed = EmbedBuilder.from(originalEmbed);

			// Déterminer le nom du champ
			let fieldName = fieldMapping[champ].name;
			if (champ === 'recrutement') {
				fieldName = embedFooter === 'JeWorld • Espace Solo' ? '🤝 Recrutement' : '📌 Recrutement';
			}

			// Récupérer les champs existants
			const fields = newEmbed.data.fields || [];
			let fieldFound = false;

			// Chercher et mettre à jour le champ s'il existe
			for (let i = 0; i < fields.length; i++) {
				if (fields[i].name === fieldName) {
					fields[i].value = valeur;
					fieldFound = true;
					break;
				}
			}

			// Si le champ n'existe pas, l'ajouter
			if (!fieldFound) {
				fields.push({
					name: fieldName,
					value: valeur,
					inline: fieldMapping[champ].inline
				});
			}

			// Appliquer les champs modifiés
			newEmbed.setFields(fields);

			// Éditer le message avec l'embed modifié
			await targetMessage.edit({ embeds: [newEmbed] });

			return interaction.editReply({
				content: `✅ Le champ "${fieldName}" a été modifié avec succès.`
			});
		} catch (error) {
			console.error('Erreur lors de la mise à jour de la fiche guilde:', error);
			return interaction.editReply({
				content: 'Une erreur s\'est produite lors de la mise à jour de la fiche guilde.'
			});
		}
	}
};
