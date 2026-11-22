import styled from 'styled-components';
import Pile from './Pile';
import { MinusIcon, PlusIcon } from './icons';

const Grid = styled.div`
  display: grid;
  gap: 20px;
  grid-template-columns: 1fr;
  grid-template-areas: 'target' 'source';
  max-width: 920px;
  margin: 0 auto;

  /* The target comes first in the DOM: on a phone the source list can be
     thousands of pixels long, and the picks belong above it. Screen readers
     also hear the progress before the list. Wide screens put it on the
     right, after the source. */
  & > section:first-child {
    grid-area: target;
    /* Its slots already make a big drop zone; stretching it to a long
       source list would just add an empty panel. */
    align-self: start;
  }

  & > section:last-child {
    grid-area: source;
  }

  @media (min-width: 720px) {
    grid-template-columns: 1fr 1fr;
    grid-template-areas: 'source target';
    gap: 28px;
  }
`;

const SelectPhase = ({ phase, piles, cards, isTargetFull, onMove }) => {
  const { source, target, limit } = phase;
  const toCards = (ids) => ids.map((id) => cards[id]);
  const full = piles[target].length >= limit;

  return (
    <Grid>
      <Pile
        pileId={target}
        title={phase.label}
        tone={phase.id === 'top3' ? 'gold' : 'accent'}
        limit={limit}
        ranked={phase.id === 'top3'}
        isDropDisabled={isTargetFull}
        cards={toCards(piles[target])}
        emptyText="Drag or add a card"
        getAction={(card) => ({
          label: `Remove ${card.title} from ${phase.label.toLowerCase()}`,
          icon: <MinusIcon size={16} />,
          onClick: () =>
            onMove({ cardId: card.id, from: target, to: source, index: 0 }),
        })}
      />
      <Pile
        pileId={source}
        title={phase.sourceTitle}
        tone="muted"
        cards={toCards(piles[source])}
        emptyText="Nothing left here"
        getAction={(card) => ({
          label: full
            ? `${phase.label} is full`
            : `Add ${card.title} to ${phase.label.toLowerCase()}`,
          icon: <PlusIcon size={16} />,
          disabled: full,
          onClick: () => onMove({ cardId: card.id, from: source, to: target }),
        })}
      />
    </Grid>
  );
};

export default SelectPhase;
