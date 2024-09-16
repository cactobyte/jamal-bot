const { Events, InteractionCollector } = require('discord.js');
const { QuickDB } = require("quick.db");
const db = new QuickDB();
const ownerId = "270499559673823234";

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        if (message.author.bot) return; 

        const prefix = '.';

        if (!message.content.startsWith(prefix)) return;

        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        if (commandName === 'eco') {
            if (!message.author.id == ownerId){
                message.reply("You have no permission.");
            } else {  
                const action = args[0].toLowerCase(); 
                const userMention = message.mentions.users.first();
                let amount = args[2]; 
                
                console.error("[jamal bot] eco command ran by " + message.author.username);
                switch (action) {
                    case 'give':
                        await db.add(`money_${userMention.id}`, amount);
                        message.reply(`Gave ${amount} to ${userMention.tag}.`);
                        break;
                    case 'take':
                        await db.sub(`money_${userMention.id}`, amount);
                        return message.reply(`Took ${amount} from ${userMention.tag}.`);
                    case 'set':
                        await db.set(`money_${userMention.id}`, amount);
                        return message.reply(`Set ${userMention.tag}'s balance to ${amount}.`);
                    default:
                        message.reply("Invalid action.");
                }
            }
        }

        else if (commandName == "db"){
            if (!message.author.id == ownerId){
                message.reply("You have no permission.");
            } else {
                const allBalances = await db.all(); 
                const balances = allBalances.filter(entry => entry.id.startsWith('money_'));

                if (balances.length === 0) {
                    return message.reply("No balances found.");
                }

                const balancesString = balances.map(entry => `${entry.id}: ${entry.value}`).join("\n");
                message.reply(`Balances:\n${balancesString}`);
            }
        }
    },
};


