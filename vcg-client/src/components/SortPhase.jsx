import { Droppable } from '@hello-pangea/dnd';
import styled from 'styled-components';
import { MIN_IMPORTANT, PILES } from '../game/game';
import Button from './Button';
import Card, { CardFace } from './Card';
import Pile from './Pile';
import { ArrowLeftIcon, ArrowRightIcon, CheckIcon } from './icons';

const Grid = styled.div`
  display: grid;
  gap: 20px;
  grid-template-columns: 1fr;
  grid-template-areas: 'deck' 'important' 'less';

  @media (min-width: 640px) {
    grid-template-columns: 1fr 1fr;
    grid-template-areas: 'deck deck' 'important less';
  }

  @media (min-width: 960px) {
    grid-template-columns: 1fr minmax(320px, 380px) 1fr;
    grid-template-areas: 'important deck less';
    gap: 28px;
  }
`;

// Piles stretch to the row height so the whole column is a drop target.
const Area = styled.div`
  grid-area: ${({ $area }) => $area};
  display: flex;
  flex-direction: column;
  min-width: 0;

  & > section {
    flex: 1;
  }
`;

const DeckColumn = styled(Area)`
  width: 100%;
  max-width: 400px;
  justify-self: center;
  align-self: start;

  @media (min-width: 960px) {
    position: sticky;
    top: 96px;
  }
`;

const Stack = styled.div`
  position: relative;
  margin: 10px 0 30px;
`;

const Behind = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  transform: translateY(${({ $depth }) => $depth * 9}px)
    scale(${({ $depth }) => 1 - $depth * 0.04});
  opacity: ${({ $depth }) => 1 - $depth * 0.25};
  transition: transform 0.25s ease;

  & > div {
    height: 100%;
  }
`;

const BlankCard = styled.div`
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
`;

const DeckDrop = styled.div`
  position: relative;
  min-height: 236px;
`;

const Progress = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 13px;
  color: var(--text-muted);
  font-variant-numeric: tabular-nums;
`;

const Bar = styled.div`
  flex: 1;
  height: 6px;
  border-radius: 6px;
  background: var(--surface-2);
  overflow: hidden;

  &::after {
    content: '';
    display: block;
    height: 100%;
    width: ${({ $value }) => $value * 100}%;
    background: var(--accent);
    border-radius: inherit;
    transition: width 0.3s ease;
  }
`;

const Choices = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-top: 18px;

  & > button {
    width: 100%;
    padding: 0 12px;
  }
`;

const Tip = styled.p`
  margin-top: 14px;
  text-align: center;
  font-size: 13px;
  color: var(--text-muted);
`;

const Done = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  min-height: 236px;
  justify-content: center;
  margin: 10px 0 30px;
  padding: 28px;
  border: 1.5px dashed var(--border-strong);
  border-radius: var(--radius-lg);
  text-align: center;
  color: var(--text-muted);
`;

const DoneBadge = styled.span`
  display: grid;
  place-items: center;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: var(--accent-soft);
  color: var(--accent);
`;

const DoneTitle = styled.h2`
  font-family: var(--font-display);
  font-size: 24px;
  font-weight: 600;
  color: var(--text);
`;

const VisuallyHidden = styled.p`
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
`;

const Deck = ({ deck, total, onSort }) => {
  const [top, next] = deck;
  const sorted = total - deck.length;

  return (
    <>
      {/* The sort buttons keep focus, so a screen reader would otherwise
          never hear which card came up next. Live regions stay quiet on
          first render, so this speaks only after a card is sorted. */}
      <VisuallyHidden aria-live="polite" aria-atomic="true">
        {`Next card: ${top.title}. ${top.description}`}
      </VisuallyHidden>
      <Progress>
        <span>
          {sorted} of {total} sorted
        </span>
        <Bar $value={sorted / total} />
      </Progress>
      <Stack>
        {deck.length > 2 && (
          <Behind $depth={2}>
            <BlankCard />
          </Behind>
        )}
        {next && (
          <Behind $depth={1} aria-hidden="true">
            <CardFace card={next} variant="deck" />
          </Behind>
        )}
        <Droppable droppableId={PILES.deck} isDropDisabled>
          {(provided) => (
            <DeckDrop ref={provided.innerRef} {...provided.droppableProps}>
              <Card key={top.id} card={top} index={0} variant="deck" />
              {provided.placeholder}
            </DeckDrop>
          )}
        </Droppable>
      </Stack>
      <Choices>
        <Button
          $variant="primary"
          onClick={() => onSort(top.id, PILES.important)}
        >
          <ArrowLeftIcon /> Matters to me
        </Button>
        <Button onClick={() => onSort(top.id, PILES.less)}>
          Less important <ArrowRightIcon />
        </Button>
      </Choices>
      <Tip>Or drag the card onto a pile.</Tip>
    </>
  );
};

const SortPhase = ({ piles, cards, total, onMove }) => {
  const toCards = (ids) => ids.map((id) => cards[id]);
  const deck = toCards(piles[PILES.deck]);
  const important = piles[PILES.important].length;

  const sortTop = (cardId, to) =>
    onMove({ cardId, from: PILES.deck, to, index: 0 });

  return (
    <Grid>
      <DeckColumn $area="deck">
        {deck.length > 0 ? (
          <Deck deck={deck} total={total} onSort={sortTop} />
        ) : (
          <Done>
            <DoneBadge>
              <CheckIcon size={26} />
            </DoneBadge>
            <DoneTitle>Deck sorted</DoneTitle>
            <p>
              {important >= MIN_IMPORTANT
                ? `${important} values matter to you.`
                : `You need at least ${MIN_IMPORTANT} values that matter. Move ${
                    MIN_IMPORTANT - important
                  } more from the less important pile.`}
            </p>
          </Done>
        )}
      </DeckColumn>
      <Area $area="important">
        <Pile
          pileId={PILES.important}
          title="Matters to me"
          tone="accent"
          cards={toCards(piles[PILES.important])}
          emptyText="Values that matter to you go here"
          getAction={(card) => ({
            label: `Move ${card.title} to less important`,
            icon: <ArrowRightIcon size={16} />,
            onClick: () =>
              onMove({
                cardId: card.id,
                from: PILES.important,
                to: PILES.less,
                index: 0,
              }),
          })}
        />
      </Area>
      <Area $area="less">
        <Pile
          pileId={PILES.less}
          title="Less important"
          tone="muted"
          cards={toCards(piles[PILES.less])}
          emptyText="Values that matter less go here"
          getAction={(card) => ({
            label: `Move ${card.title} to matters to me`,
            icon: <ArrowLeftIcon size={16} />,
            onClick: () =>
              onMove({
                cardId: card.id,
                from: PILES.less,
                to: PILES.important,
                index: 0,
              }),
          })}
        />
      </Area>
    </Grid>
  );
};

export default SortPhase;
