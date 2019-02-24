import { Help } from './list/Help';

//add here import tl all command  from list folder

const commandList = [];
commandList.push(new Help({ commandList }));
export { commandList };
