import { describe, expect, it } from 'vitest';
import { deckOrder } from '../data/initial-data';
import {
  MIN_IMPORTANT,
  PILES,
  createInitialState,
  goBack,
  goNext,
  moveCard,
  phaseStatus,
  restoreState,
  serializeState,
} from './game';

const sortDeck = (state, importantCount) =>
  state.piles[PILES.deck].reduce(
    (s, cardId, i) =>
      moveCard(s, {
        cardId,
        from: PILES.deck,
        to: i < importantCount ? PILES.important : PILES.less,
      }),
    state,
  );

const pick = (state, from, to, count) =>
  state.piles[from]
    .slice(0, count)
    .reduce((s, cardId) => moveCard(s, { cardId, from, to }), state);

describe('sort phase', () => {
  it('starts with every card in the deck', () => {
    const state = createInitialState();
    expect(state.phase).toBe(0);
    expect(state.piles[PILES.deck]).toEqual(deckOrder);
    expect(phaseStatus(state)).toEqual({
      complete: false,
      hint: `${deckOrder.length} cards left to sort`,
    });
  });

  it('needs the whole deck sorted before continuing', () => {
    const initial = createInitialState();
    const halfSorted = pick(initial, PILES.deck, PILES.important, 20);
    expect(phaseStatus(halfSorted)).toEqual({
      complete: false,
      hint: `${deckOrder.length - 20} cards left to sort`,
    });
    expect(goNext(halfSorted)).toBe(halfSorted);
    expect(phaseStatus(sortDeck(initial, 20)).complete).toBe(true);
  });

  it(`needs at least ${MIN_IMPORTANT} important values`, () => {
    const state = sortDeck(createInitialState(), MIN_IMPORTANT - 1);
    expect(phaseStatus(state).complete).toBe(false);
    expect(goNext(state).phase).toBe(0);
    expect(goNext(sortDeck(createInitialState(), MIN_IMPORTANT)).phase).toBe(
      1,
    );
  });

  it('never accepts cards back into the deck', () => {
    const state = sortDeck(createInitialState(), 10);
    const cardId = state.piles[PILES.important][0];
    expect(
      moveCard(state, { cardId, from: PILES.important, to: PILES.deck }),
    ).toBe(state);
  });
});

describe('selection rounds', () => {
  const atTop8 = () => goNext(sortDeck(createInitialState(), 12));

  it('caps the target pile at its limit', () => {
    const full = pick(atTop8(), PILES.important, PILES.top8, 8);
    expect(phaseStatus(full)).toEqual({ complete: true, hint: '8 picked' });

    const overflow = pick(full, PILES.important, PILES.top8, 1);
    expect(overflow).toBe(full);
  });

  it('still allows reordering a full target pile', () => {
    const full = pick(atTop8(), PILES.important, PILES.top8, 8);
    const [first, second] = full.piles[PILES.top8];
    const reordered = moveCard(full, {
      cardId: first,
      from: PILES.top8,
      to: PILES.top8,
      index: 1,
    });
    expect(reordered.piles[PILES.top8].slice(0, 2)).toEqual([second, first]);
  });

  it('going back undoes the round so the previous selection is whole', () => {
    let state = pick(atTop8(), PILES.important, PILES.top8, 8);
    state = goNext(state);
    state = pick(state, PILES.top8, PILES.top5, 3);
    expect(state.piles[PILES.top8]).toHaveLength(5);

    const back = goBack(state);
    expect(back.phase).toBe(1);
    expect(back.piles[PILES.top8]).toHaveLength(8);
    expect(back.piles[PILES.top5]).toHaveLength(0);
  });

  it('reaches the result after top 3', () => {
    let state = pick(atTop8(), PILES.important, PILES.top8, 8);
    state = pick(goNext(state), PILES.top8, PILES.top5, 5);
    state = pick(goNext(state), PILES.top5, PILES.top3, 3);
    state = goNext(state);
    expect(state.phase).toBe(4);
    expect(goNext(state)).toBe(state);
    expect(goBack(state).piles).toBe(state.piles);
  });
});

describe('restoreState', () => {
  it('round-trips a serialized game', () => {
    const state = goNext(sortDeck(createInitialState(), 9));
    const saved = JSON.parse(JSON.stringify(serializeState(state)));
    expect(restoreState(saved)).toEqual(state);
  });

  it('migrates a save from before the redesign', () => {
    const ids = [...deckOrder];
    const legacy = {
      cards: {},
      stepGroups: {},
      currentStep: 2,
      steps: {
        'step-1': { cardIds: [] },
        'step-2': { cardIds: ids.slice(2, 15) },
        'step-3': { cardIds: ids.slice(15) },
        'step-4': { cardIds: ids.slice(0, 2) },
        'step-5': { cardIds: [] },
        'step-6': { cardIds: [] },
      },
    };
    const state = restoreState(legacy);
    expect(state.phase).toBe(1);
    expect(state.piles[PILES.top8]).toEqual(ids.slice(0, 2));
  });

  it.each([
    ['nothing saved', null],
    ['an unknown shape', { foo: 1 }],
    [
      'a missing card',
      serializeState({
        ...createInitialState(),
        piles: { ...createInitialState().piles, deck: deckOrder.slice(1) },
      }),
    ],
    [
      'a duplicated card',
      serializeState({
        ...createInitialState(),
        piles: { ...createInitialState().piles, less: [deckOrder[0]] },
      }),
    ],
    ['an out-of-range phase', serializeState({ ...createInitialState(), phase: 9 })],
  ])('rejects %s', (_, saved) => {
    expect(restoreState(saved)).toBeNull();
  });
});
