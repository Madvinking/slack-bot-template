import { getLogger } from '../../config/index';
export class Command {
  constructor({ name, description, loggerName }) {
    this.name = name;
    this.description = description;
    this.logger = getLogger(loggerName);
  }

  async invoke() {
    throw new Error('Method `invoke` must be overridden!');
  }

  info() {
    const { name, description } = this;
    return `*${name}* - ${description}`;
  }

  error(err) {
    this.logger(err);
  }
}
