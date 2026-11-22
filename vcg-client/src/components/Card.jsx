import { Draggable } from '@hello-pangea/dnd';
import styled, { css } from 'styled-components';

// Spacing lives on the draggable wrapper as a margin: the drag library
// measures margins, but not flex/grid `gap`.
const Wrapper = styled.div`
  margin-bottom: ${({ $variant }) => ($variant === 'compact' ? '8px' : '0')};
  outline: none;

  /* The card face draws its own rounded ring; without this the global
     square :focus-visible outline shows around it as a second ring. */
  &:focus-visible {
    outline: none;
  }

  &:focus-visible > div {
    box-shadow: 0 0 0 2px var(--accent), var(--shadow-md);
  }
`;

const variants = {
  compact: css`
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 12px 12px 12px 14px;
    border-radius: var(--radius-sm);
  `,
  deck: css`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 14px;
    min-height: 236px;
    padding: 36px 28px;
    border-radius: var(--radius-lg);
    text-align: center;
  `,
  featured: css`
    display: flex;
    flex-direction: column;
    gap: 10px;
    height: 100%;
    padding: 26px 24px 28px;
    border-radius: var(--radius);
  `,
};

const Face = styled.div`
  position: relative;
  background: var(--surface);
  border: 1px solid var(--border);
  box-shadow: var(--shadow-sm);
  cursor: ${({ $draggable }) => ($draggable ? 'grab' : 'default')};
  user-select: none;
  transition: box-shadow 0.2s ease, transform 0.2s ease, border-color 0.2s ease;

  ${({ $variant }) => variants[$variant]}

  ${({ $draggable }) =>
    $draggable &&
    css`
      &:hover {
        border-color: var(--border-strong);
        box-shadow: var(--shadow-md);
      }
    `}

  ${({ $isDragging }) =>
    $isDragging &&
    css`
      cursor: grabbing;
      border-color: var(--accent);
      box-shadow: var(--shadow-lg);
      transform: rotate(-2deg) scale(1.03);
    `}
`;

const Text = styled.div`
  flex: ${({ $variant }) => ($variant === 'deck' ? 'none' : '1')};
  min-width: 0;
`;

const Title = styled.h3`
  font-family: var(--font-display);
  font-variant-numeric: lining-nums tabular-nums;
  font-weight: 600;
  letter-spacing: -0.01em;
  line-height: 1.2;
  font-size: ${({ $variant }) =>
    ({ compact: '16px', deck: '30px', featured: '24px' }[$variant])};
  overflow-wrap: anywhere;
`;

const Description = styled.p`
  color: var(--text-muted);
  font-size: ${({ $variant }) =>
    ({ compact: '13px', deck: '16px', featured: '15px' }[$variant])};
  line-height: 1.45;
  margin: ${({ $variant }) =>
    ({ compact: '2px 0 0', deck: '12px auto 0', featured: '8px 0 0' }[
      $variant
    ])};
  max-width: ${({ $variant }) => ($variant === 'deck' ? '30ch' : 'none')};
`;

const Ornament = styled.span`
  width: 32px;
  height: 3px;
  border-radius: 3px;
  background: var(--gold);
  opacity: 0.8;
`;

const Rank = styled.span`
  flex: none;
  display: grid;
  place-items: center;
  width: ${({ $variant }) => ($variant === 'featured' ? '40px' : '26px')};
  height: ${({ $variant }) => ($variant === 'featured' ? '40px' : '26px')};
  border-radius: 50%;
  background: var(--gold-soft);
  color: var(--gold);
  font-family: var(--font-display);
  font-variant-numeric: lining-nums tabular-nums;
  font-weight: 700;
  font-size: ${({ $variant }) => ($variant === 'featured' ? '20px' : '14px')};
  /* Browsers drop backgrounds when printing; keep the badge's circle. */
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
`;

const ActionButton = styled.button`
  flex: none;
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  margin: -2px -2px 0 0;
  padding: 0;
  border: 1px solid var(--border);
  border-radius: 50%;
  background: var(--surface);
  color: var(--text-muted);
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease;

  &:hover:not(:disabled) {
    background: var(--accent);
    border-color: var(--accent);
    color: var(--accent-contrast);
  }

  &:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }

  /* Focus moved here after a click elsewhere (see keepFocus in Pile). */
  &[data-pointer-focus]:focus-visible {
    outline: none;
  }
`;

export const CardFace = ({
  card,
  variant = 'compact',
  rank,
  action,
  isDragging = false,
  draggable = false,
}) => (
  <Face $variant={variant} $isDragging={isDragging} $draggable={draggable}>
    {rank !== undefined && <Rank $variant={variant}>{rank}</Rank>}
    {variant === 'deck' && <Ornament />}
    <Text $variant={variant}>
      <Title $variant={variant}>{card.title}</Title>
      <Description $variant={variant}>{card.description}</Description>
    </Text>
    {action && (
      <ActionButton
        type="button"
        onClick={action.onClick}
        disabled={action.disabled}
        aria-label={action.label}
        title={action.label}
        data-card-action={card.id}
      >
        {action.icon}
      </ActionButton>
    )}
  </Face>
);

const Card = ({ card, index, variant, rank, action }) => (
  <Draggable draggableId={card.id} index={index}>
    {(provided, snapshot) => (
      <Wrapper
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        $variant={variant}
      >
        <CardFace
          card={card}
          variant={variant}
          rank={rank}
          action={action}
          draggable
          isDragging={snapshot.isDragging && !snapshot.isDropAnimating}
        />
      </Wrapper>
    )}
  </Draggable>
);

export default Card;
