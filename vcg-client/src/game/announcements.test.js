import { describe, expect, it } from 'vitest';
import { cards } from '../data/initial-data';
import {
  dragEndMessage,
  dragStartMessage,
  dragUpdateMessage,
} from './announcements';
import { PILES, createInitialState, goNext, moveCard } from './game';

const at = (droppableId, index) => ({ droppableId, index });

// Round 1 with three cards sorted into "Matters to me".
const sorting = () => {
  const initial = createInitialState();
  return initial.piles[PILES.deck]
    .slice(0, 3)
    .reduce(
      (s, cardId) => moveCard(s, { cardId, from: PILES.deck, to: PILES.important }),
      initial,
    );
};

// Top 8 round: everything sorted, 12 values matter, two picked.
const choosingTop8 = () => {
  let state = createInitialState();
  state.piles[PILES.deck].forEach((cardId, i) => {
    state = moveCard(state, {
      cardId,
      from: PILES.deck,
      to: i < 12 ? PILES.important : PILES.less,
    });
  });
  state = goNext(state);
  state.piles[PILES.important].slice(0, 2).forEach((cardId) => {
    state = moveCard(state, { cardId, from: PILES.important, to: PILES.top8 });
  });
  return state;
};

describe('drag announcements', () => {
  it('names the card picked up from the deck', () => {
    const state = sorting();
    const cardId = state.piles[PILES.deck][0];
    expect(
      dragStartMessage(state, { draggableId: cardId, source: at(PILES.deck, 0) }),
    ).toMatch(new RegExp(`^Picked up ${cards[cardId].title} from the deck\\.`));
  });

  it('gives the pile and position when picking up from a pile', () => {
    const state = sorting();
    const cardId = state.piles[PILES.important][1];
    expect(
      dragStartMessage(state, {
        draggableId: cardId,
        source: at(PILES.important, 1),
      }),
    ).toMatch(`${cards[cardId].title} from Matters to me, position 2 of 3.`);
  });

  it('uses the round’s on-screen name for the source pile', () => {
    const state = choosingTop8();
    const cardId = state.piles[PILES.important][0];
    const update = {
      draggableId: cardId,
      source: at(PILES.important, 0),
      destination: at(PILES.top8, 2),
    };
    expect(dragUpdateMessage(state, update)).toBe(
      `${cards[cardId].title}: Top 8, position 3 of 3.`,
    );
    expect(
      dragUpdateMessage(state, { ...update, destination: at(PILES.important, 4) }),
    ).toBe(`${cards[cardId].title}: Values that matter, position 5 of 10.`);
    expect(dragUpdateMessage(state, { ...update, destination: null })).toBe(
      `${cards[cardId].title} is not over a pile.`,
    );
  });

  it('says where the card ended up', () => {
    const state = choosingTop8();
    const cardId = state.piles[PILES.top8][0];
    const title = cards[cardId].title;
    const base = { draggableId: cardId, source: at(PILES.top8, 0), reason: 'DROP' };

    expect(
      dragEndMessage(state, { ...base, destination: at(PILES.important, 0) }),
    ).toBe(`${title} moved to Values that matter, position 1.`);
    expect(dragEndMessage(state, { ...base, destination: at(PILES.top8, 1) })).toBe(
      `${title} moved to position 2 in Top 8.`,
    );
    expect(dragEndMessage(state, { ...base, destination: at(PILES.top8, 0) })).toBe(
      `${title} dropped back where it was.`,
    );
    expect(dragEndMessage(state, { ...base, destination: null })).toBe(
      `${title} was not dropped on a pile, so it is back in Top 8.`,
    );
    expect(
      dragEndMessage(state, { ...base, reason: 'CANCEL', destination: null }),
    ).toBe(`Cancelled. ${title} is back in Top 8.`);
  });
});
