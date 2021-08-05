// Type definitions for @dplocki/generic-conversation-bot 0.1.0
// Project: https://github.com/dplocki/generic-conversation-bot
declare module '@dplocki/generic-conversation-bot' {

  interface Json {
    [key: string]: string | number | boolean | Date | Json | JsonArray;
  }

  interface JsonArray extends Array<string | number | boolean | Date | Json | JsonArray> { }

  class Bot {
    constructor(statesMap: Bot);
    addAction(actionSource: Array<Function>): void;
    jumpToState(stateName: string): void;
    message(message: string): {};
    nextAction(): void;
    reset(): void;
  }

  class ParserBuilder {
    constructor();
    addCustomActions(actions: { [key: string]: Function }): void;
    addCustomStates(states: { [key: string]: Function }): void;
    addPreParsers(preParsers: { [key: string]: Function }): void;
    parse(jsonStatesArray: JsonArray): Bot;
  }

  class Simplifier {
    constructor(bot: Bot);
    message(message: string): string;
    reset(): void;
    isReset: boolean;
  }

  function buildBot(stateMap: any): Simplifier;
}
