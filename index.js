const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');
const {token} = require('./settings.json');

const client = new Client({
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS],
});

client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
}

client.once('ready', () => {
	console.log('Ready!');
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
	  await command.execute(interaction);
		console.log(`${new Date()}\nRan Commmand (Succesfully): ${command.data.name}`)
	} catch (error) {
		console.log(`${new Date()}\nRan Commmand (Unsuccesfully): ${command.data.name}`)
		console.error(error);
		return interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

client.login(token);