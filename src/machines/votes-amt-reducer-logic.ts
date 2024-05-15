import { Vote } from '@prisma/client'
import { fromTransition } from 'xstate'

type Event = { type: Vote }
type VotesAmtCtx = { votesAmt: number; voteType: Vote | null | undefined }
export const votesAmountLogic = fromTransition(
  (state: VotesAmtCtx, event: Event) => {
    switch (event.type) {
      case 'UP': {
        if (state.voteType === 'UP') return { votesAmt: state.votesAmt - 1, voteType: null }
        else if (state.voteType === 'DOWN') return { votesAmt: state.votesAmt + 2, voteType: 'UP' as Vote }
        else return { votesAmt: state.votesAmt + 1, voteType: 'UP' as Vote }
      }

      case 'DOWN': {
        if (state.voteType === 'DOWN') return { votesAmt: state.votesAmt + 1, voteType: null }
        else if (state.voteType === 'UP') return { votesAmt: state.votesAmt - 2, voteType: 'DOWN' as Vote }
        else return { votesAmt: state.votesAmt - 1, voteType: 'DOWN' as Vote }
      }

      default: {
        return state
      }
    }
  },
  ({ input }: { input: VotesAmtCtx }) => input
)
