import { Command } from '../Command';

export class Help extends Command {
  static name = 'help';
  static description = 'return the list of all available commands';
  static title = '*this are all the available commands:*';
  static noCommand = "can't find command";
  static loggerName = __filename;

  constructor({ commandList }) {
    const { name, description, loggerName } = Help;
    super({ name, description, loggerName });
    this.commandList = commandList;

    let text = [
      Help.title,
      `*${name}* - ${description}`,
      ...commandList.map(c => c.info())
    ];
    this.all = text.join('\n');
  }

  invoke({ channel, instructions: cName = null }) {
    if (cName) {
      let command = this.commandList.find(({ name }) => name === cName);
      if (command) return { text: command.info(), channel };
      return { text: Help.noCommand, channel };
    }
    return { text: this.all, channel };
  }
}
