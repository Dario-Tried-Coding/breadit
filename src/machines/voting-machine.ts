import { Vote } from '@prisma/client'
import { assign, setup } from 'xstate'

type Context = {
  votesAmt: number
  voteType: Vote | null
}

export const votingLogic = setup({
  types: {
    input: {} as Context,
    context: {} as Context & { prev: Context | undefined },
    events: {} as { type: 'click'; voteType: Vote } | { type: 'vote.success' } | { type: 'vote.error' },
  },
  actions: {
    storeCurrentCtx: assign(({ context: { voteType, votesAmt } }) => ({ prev: { voteType, votesAmt } })),
    restorePrevContext: assign(({ context: { prev } }) => ({ ...prev })),
    updateCtx: assign(({ context }, params: { voteType: Vote }) => {
      if (!context.voteType) {
        return {
          votesAmt: context.votesAmt + (params.voteType === 'UP' ? 1 : -1),
          voteType: params.voteType,
        }
      }

      if (context.voteType === params.voteType) {
        return {
          votesAmt: context.votesAmt + (params.voteType === 'UP' ? -1 : 1),
          voteType: null,
        }
      }

      return {
        votesAmt: context.votesAmt + (params.voteType === 'UP' ? 2 : -2),
        voteType: params.voteType,
      }
    }),
    sendVote: () => {},
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QDcD2AXAlgOygYgGMAbTAgawG0AGAXUVAAdVZMtVt6QAPRARgBZeAGhABPRAFoAzACYAHAF8FItFlx5VYAHSwArgQJxY1OkhBMWbDmZ4IJMqgFYt-KQHZHI8XalOtMtylXDyUVDBx8TS0wACcY1BiTTgtWTHZOWwlHfi03AE4ZPIA2OQ8vSVlFZRBVCK0IMAAjVF1sAgi8Llh0AEN0bR6AM36YgApeKkmASg1w3HqmlraIpLMUqwy+Vy05eV4ZTzFJfbctPMcZKTkqc8vrvKVq7FQG+DNa3GTmVPSbSQOpC53IdvBJBM5HKEanMoFpMBAiGAvpY0tZQJleI43OU7DJeLwoR9YQ1mq12p81t8Nn8ELwrmcSmUjnZeKUtJDqkSdD1kBEAGoYJGUlG-dFbXjsnESOm5DlKIA */
  id: 'voting',

  context: ({ input }) => ({
    ...input,
    prev: undefined,
  }),

  states: {
    idle: {
      entry: 'storeCurrentCtx',
    },

    debouncing: {
      after: {
        '500': {
          target: 'savingVote',
          actions: 'sendVote',
        },
      },
    },

    savingVote: {},
  },

  initial: 'idle',

  on: {
    click: {
      target: '.debouncing',
      actions: [
        {
          type: 'updateCtx',
          params: ({ event: { voteType } }) => ({ voteType }),
        },
      ],
    },

    'vote.success': '.idle',
    'vote.error': {
      target: '.idle',
      actions: 'restorePrevContext',
    },
  },
})
