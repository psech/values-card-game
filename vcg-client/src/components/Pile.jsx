import { Droppable } from '@hello-pangea/dnd';
import styled, { css } from 'styled-components';
import Card from './Card';

const tones = {
  accent: { dot: 'var(--accent)', over: 'var(--accent-soft)' },
  gold: { dot: 'var(--gold)', over: 'var(--gold-soft)' },
  muted: { dot: 'var(--border-strong)', over: 'var(--muted-soft)' },
};

const Container = styled.section`
  display: flex;
  flex-direction: column;
  min-width: 0;
  background: var(--surface-2);
  border-radius: var(--radius);
  padding: 6px;
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 10px 12px;
`;

const Dot = styled.span`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${({ $tone }) => tones[$tone].dot};
`;

const Title = styled.h2`
  flex: 1;
  font-size: 14px;
  font-weight: 600;
`;

const Count = styled.span`
  font-size: 13px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  color: ${({ $done }) => ($done ? 'var(--accent)' : 'var(--text-muted)')};
  background: var(--surface);
  border-radius: 999px;
  padding: 2px 10px;
`;

const List = styled.div`
  flex: 1;
  min-height: 140px;
  padding: 8px 8px 0;
  border-radius: calc(var(--radius) - 4px);
  background: ${({ $isOver, $tone }) =>
    $isOver ? tones[$tone].over : 'transparent'};
  transition: background 0.2s ease;
  /* The page scrolls, not the pile: an inner scroll box ends up partly
     behind the sticky action bar on short screens. 'clip' (unlike
     'hidden') doesn't create a scroll container, and stops the deck-sized
     drop placeholder from widening the page. */
  overflow-x: clip;

  ${({ $disabled }) =>
    $disabled &&
    css`
      opacity: 0.6;
    `}
`;

const Slot = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  height: 52px;
  margin-bottom: 8px;
  padding: 0 14px;
  border: 1.5px dashed var(--border-strong);
  border-radius: var(--radius-sm);
  color: var(--text-muted);
  font-size: 13px;
`;

const SlotNumber = styled.span`
  font-family: var(--font-display);
  font-variant-numeric: lining-nums tabular-nums;
  font-weight: 600;
  font-size: 15px;
`;

const Empty = styled.p`
  display: grid;
  place-items: center;
  min-height: 124px;
  margin-bottom: 8px;
  padding: 16px;
  border: 1.5px dashed var(--border-strong);
  border-radius: var(--radius-sm);
  color: var(--text-muted);
  font-size: 14px;
  text-align: center;
`;

// A card's action button moves the card to another pile, so the button that
// was pressed disappears and focus falls back to the top of the page. Keep
// the player's place instead: focus the button now at the same spot in this
// pile, so they can carry on down the list. If there is none to press (the
// pile is empty, or the target is full), follow the card to its new pile.
// React has committed the move by the next frame. Piles are found by our
// own data-pile attribute, not the drag library's, which changes between
// libraries (react-beautiful-dnd's data-rbd-* became data-rfd-*).
const keepFocus = (pileId, index, cardId, fromPointer) =>
  requestAnimationFrame(() => {
    const buttons = document.querySelectorAll(
      `[data-pile="${pileId}"] [data-card-action]`,
    );
    const sameSpot = buttons[Math.min(index, buttons.length - 1)];
    const target =
      sameSpot && !sameSpot.disabled
        ? sameSpot
        : document.querySelector(`[data-card-action="${cardId}"]`);
    if (!target) return;
    if (fromPointer) {
      // A mouse or touch user is looking at where they clicked: don't
      // scroll the page, and don't draw a focus ring they didn't ask for.
      // The ring comes back once they use the keyboard.
      target.dataset.pointerFocus = '';
      const clear = () => delete target.dataset.pointerFocus;
      target.addEventListener('blur', clear, { once: true });
      target.addEventListener('keydown', clear, { once: true });
    }
    target.focus({ preventScroll: fromPointer });
  });

const Pile = ({
  pileId,
  title,
  tone = 'muted',
  cards,
  limit,
  ranked = false,
  isDropDisabled = false,
  emptyText = 'Drag cards here',
  getAction,
}) => {
  return (
    <Container aria-label={title} data-pile={pileId}>
      <Header>
        <Dot $tone={tone} />
        <Title>{title}</Title>
        <Count $done={limit !== undefined && cards.length === limit}>
          {limit !== undefined ? `${cards.length} / ${limit}` : cards.length}
        </Count>
      </Header>
      <Droppable droppableId={pileId} isDropDisabled={isDropDisabled}>
        {(provided, snapshot) => {
          const incoming =
            snapshot.isDraggingOver && !snapshot.draggingFromThisWith ? 1 : 0;
          const freeSlots =
            limit === undefined
              ? 0
              : Math.max(0, limit - cards.length - incoming);

          return (
            <List
              ref={provided.innerRef}
              {...provided.droppableProps}
              $isOver={snapshot.isDraggingOver}
              $tone={tone}
              $disabled={isDropDisabled}
            >
              {cards.map((card, index) => {
                const action = getAction?.(card);
                return (
                  <Card
                    key={card.id}
                    card={card}
                    index={index}
                    variant="compact"
                    rank={ranked ? index + 1 : undefined}
                    action={
                      action && {
                        ...action,
                        onClick: (event) => {
                          action.onClick(event);
                          // Keyboard activation fires a click with detail 0.
                          keepFocus(pileId, index, card.id, event.detail > 0);
                        },
                      }
                    }
                  />
                );
              })}
              {provided.placeholder}
              {Array.from({ length: freeSlots }, (_, i) => (
                <Slot key={i}>
                  <SlotNumber>{cards.length + incoming + i + 1}</SlotNumber>
                  {i === 0 && cards.length === 0 && !incoming && emptyText}
                </Slot>
              ))}
              {limit === undefined && cards.length === 0 && !incoming && (
                <Empty>{emptyText}</Empty>
              )}
            </List>
          );
        }}
      </Droppable>
    </Container>
  );
};

export default Pile;
