import { buildBot, ParserBuilder } from '@dplocki/generic-conversation-bot';

const contents = [
  {
    name: 'start',
    type: 'wait_for_activation',
    activation: 'hi',
    actions: [
      ['jump_to_state', 'first'],
    ],
  },
  {
    name: 'first',
    type: 'move_next',
    text: 'Welcome, what is your name?',
    actions: [
      ['remember_input_as', 'user_name'],
      ['jump_to_state', 'second'],
    ],
  },
  {
    name: 'second',
    type: 'move_next',
    text: 'Nice to meet you {user_name}!',
    actions: [
      ['jump_to_state', 'third'],
    ],
  },
  {
    name: 'third',
    type: 'move_next',
    text: 'Right... I will restart now',
    actions: [
      'end_conversation',
    ],
  },
];

const bot = buildBot(new ParserBuilder().parse(contents));

export default bot;
