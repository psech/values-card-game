import { cards, deckOrder } from '../data/initial-data';

export const PILES = {
  deck: 'deck',
  important: 'important',
  less: 'less',
  top8: 'top8',
  top5: 'top5',
  top3: 'top3',
};

export const MIN_IMPORTANT = 8;

// Each card lives in exactly one pile. Picking a card for the next round moves
// it out of the previous pile, so "your top 8" at the end is top8 + top5 + top3.
export const PHASES = [
  {
    id: 'sort',
    label: 'Sort',
    title: 'Sort the deck',
    description:
      'Go through every card and decide: does this value really matter to you, or is it less important?',
  },
  {
    id: 'top8',
    label: 'Top 8',
    title: 'Choose your top 8',
    description:
      'From the values that matter to you, pick the eight you would keep no matter what.',
    source: PILES.important,
    sourceTitle: 'Values that matter',
    target: PILES.top8,
    limit: 8,
  },
  {
    id: 'top5',
    label: 'Top 5',
    title: 'Narrow it to 5',
    description: 'Harder now. Which five of your top eight come first?',
    source: PILES.top8,
    sourceTitle: 'Your top 8',
    target: PILES.top5,
    limit: 5,
  },
  {
    id: 'top3',
    label: 'Top 3',
    title: 'Your final 3',
    description:
      'The last cut. Pick three, and drag them into order: the first is your most cherished value.',
    source: PILES.top5,
    sourceTitle: 'Your top 5',
    target: PILES.top3,
    limit: 3,
  },
  {
    id: 'result',
    label: 'Result',
    title: 'Your core values',
    description: 'These are the values you said matter most.',
  },
];

export const RESULT_PHASE = PHASES.length - 1;

export const pileLimit = (pileId) =>
  PHASES.find((phase) => phase.target === pileId)?.limit;

export const createInitialState = () => ({
  phase: 0,
  piles: {
    [PILES.deck]: [...deckOrder],
    [PILES.important]: [],
    [PILES.less]: [],
    [PILES.top8]: [],
    [PILES.top5]: [],
    [PILES.top3]: [],
  },
});

export const canMoveTo = (state, from, to) => {
  if (from === to) return true;
  if (to === PILES.deck) return false;
  const limit = pileLimit(to);
  return limit === undefined || state.piles[to].length < limit;
};

export const moveCard = (state, { cardId, from, to, index }) => {
  if (!canMoveTo(state, from, to)) return state;
  if (!state.piles[from].includes(cardId)) return state;

  const fromIds = state.piles[from].filter((id) => id !== cardId);
  const toIds = from === to ? fromIds : [...state.piles[to]];
  const at = index === undefined ? toIds.length : index;
  toIds.splice(at, 0, cardId);

  return {
    ...state,
    piles: { ...state.piles, [from]: fromIds, [to]: toIds },
  };
};

// Returns whether the player may continue, and what is still missing if not.
export const phaseStatus = (state) => {
  const phase = PHASES[state.phase];
  const { piles } = state;

  if (phase.id === 'sort') {
    const left = piles[PILES.deck].length;
    if (left > 0) {
      return {
        complete: false,
        hint: `${left} ${left === 1 ? 'card' : 'cards'} left to sort`,
      };
    }
    const important = piles[PILES.important].length;
    if (important < MIN_IMPORTANT) {
      return {
        complete: false,
        hint: `Mark at least ${MIN_IMPORTANT} values as important (${important} so far)`,
      };
    }
    return { complete: true, hint: 'All sorted' };
  }

  if (phase.target) {
    const picked = piles[phase.target].length;
    if (picked < phase.limit) {
      return { complete: false, hint: `Pick ${phase.limit - picked} more` };
    }
    if (picked > phase.limit) {
      return { complete: false, hint: `Remove ${picked - phase.limit}` };
    }
    return { complete: true, hint: `${phase.limit} picked` };
  }

  return { complete: true, hint: '' };
};

export const goNext = (state) =>
  phaseStatus(state).complete && state.phase < RESULT_PHASE
    ? { ...state, phase: state.phase + 1 }
    : state;

// Going back from a selection round undoes it: the picked cards return to the
// round's source pile, so the previous round's selection is whole again.
export const goBack = (state) => {
  if (state.phase === 0) return state;
  const phase = PHASES[state.phase];
  if (!phase.target) return { ...state, phase: state.phase - 1 };

  return {
    phase: state.phase - 1,
    piles: {
      ...state.piles,
      [phase.source]: [
        ...state.piles[phase.target],
        ...state.piles[phase.source],
      ],
      [phase.target]: [],
    },
  };
};

const isValidState = (state) => {
  if (!state || !Number.isInteger(state.phase)) return false;
  if (state.phase < 0 || state.phase > RESULT_PHASE) return false;
  if (!state.piles) return false;

  const placed = Object.values(PILES).flatMap((pile) => {
    const ids = state.piles[pile];
    return Array.isArray(ids) ? ids : [null];
  });
  return (
    placed.length === deckOrder.length &&
    new Set(placed).size === placed.length &&
    placed.every((id) => id in cards)
  );
};

const V1_PILES = {
  'step-1': PILES.deck,
  'step-2': PILES.important,
  'step-3': PILES.less,
  'step-4': PILES.top8,
  'step-5': PILES.top5,
  'step-6': PILES.top3,
};

// Saved games from before the redesign stored the whole data set, with
// `currentStep` 1..4 meaning "sort" .. "top 3".
const migrateV1 = (saved) => {
  if (!saved.steps || !Number.isInteger(saved.currentStep)) return null;
  const piles = {};
  Object.entries(V1_PILES).forEach(([step, pile]) => {
    piles[pile] = saved.steps[step]?.cardIds;
  });
  return { phase: saved.currentStep - 1, piles };
};

export const restoreState = (saved) => {
  if (!saved) return null;
  const state = saved.version === 2 ? saved.state : migrateV1(saved);
  return isValidState(state) ? state : null;
};

export const serializeState = (state) => ({ version: 2, state });
