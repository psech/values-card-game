import { cards } from '../data/initial-data';
import { PHASES, PILES } from './game';

// Screen-reader messages for drags. react-beautiful-dnd's defaults only say
// "item" and "list", so a blind player never hears which value they hold or
// where it is going. Every message here names the card and the pile, as the
// pile is titled on screen in the current round.

const PILE_NAMES = {
  [PILES.deck]: 'the deck',
  [PILES.important]: 'Matters to me',
  [PILES.less]: 'Less important',
  [PILES.top8]: 'Top 8',
  [PILES.top5]: 'Top 5',
  [PILES.top3]: 'Top 3',
};

const pileName = (state, pileId) => {
  const phase = PHASES[state.phase];
  return pileId === phase.source ? phase.sourceTitle : PILE_NAMES[pileId];
};

const titleOf = (draggableId) => cards[draggableId]?.title ?? 'The card';

export const dragStartMessage = (state, { draggableId, source }) => {
  const title = titleOf(draggableId);
  const keys = 'Use the arrow keys to move it, Space to drop it, or Escape to cancel.';
  if (source.droppableId === PILES.deck) {
    return `Picked up ${title} from the deck. ${keys}`;
  }
  const count = state.piles[source.droppableId].length;
  return `Picked up ${title} from ${pileName(state, source.droppableId)}, position ${
    source.index + 1
  } of ${count}. ${keys}`;
};

export const dragUpdateMessage = (state, { draggableId, source, destination }) => {
  const title = titleOf(draggableId);
  if (!destination) return `${title} is not over a pile.`;

  const { droppableId, index } = destination;
  if (droppableId === PILES.deck) return `${title} is back on the deck.`;

  const sameSize = droppableId === source.droppableId;
  const count = state.piles[droppableId].length + (sameSize ? 0 : 1);
  return `${title}: ${pileName(state, droppableId)}, position ${index + 1} of ${count}.`;
};

export const dragEndMessage = (state, { draggableId, source, destination, reason }) => {
  const title = titleOf(draggableId);
  const from = pileName(state, source.droppableId);

  if (reason === 'CANCEL') return `Cancelled. ${title} is back in ${from}.`;
  if (!destination || destination.droppableId === PILES.deck) {
    return `${title} was not dropped on a pile, so it is back in ${from}.`;
  }

  const { droppableId, index } = destination;
  if (droppableId === source.droppableId) {
    return index === source.index
      ? `${title} dropped back where it was.`
      : `${title} moved to position ${index + 1} in ${from}.`;
  }
  return `${title} moved to ${pileName(state, droppableId)}, position ${index + 1}.`;
};
