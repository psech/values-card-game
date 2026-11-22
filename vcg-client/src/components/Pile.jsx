import { Droppable } from 'react-beautiful-dnd';
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
    <Container aria-label={title}>
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
              {cards.map((card, index) => (
                <Card
                  key={card.id}
                  card={card}
                  index={index}
                  variant="compact"
                  rank={ranked ? index + 1 : undefined}
                  action={getAction?.(card)}
                />
              ))}
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
