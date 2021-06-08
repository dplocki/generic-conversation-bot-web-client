// Type definitions for @dplocki/generic-conversation-bot 0.1.0
// Project: https://github.com/dplocki/generic-conversation-bot
declare module '@dplocki/generic-conversation-bot' {

  class Bot {
      constructor(...args: any[]);

      addAction(...args: any[]): void;

      jumpToState(...args: any[]): void;

      message(...args: any[]): void;

      nextAction(...args: any[]): void;

      reset(...args: any[]): void;

  }

  class ParserBuilder {
      constructor(...args: any[]);

      addCustomActions(...args: any[]): void;

      addCustomStates(...args: any[]): void;

      addPreParsers(...args: any[]): void;

      parse(...args: any[]): void;

    }

  class Simplifier {
      constructor(...args: any[]);

      message(...args: any[]): void;

      reset(...args: any[]): void;

  }

  function buildBot(stateMap: any): void;
}
