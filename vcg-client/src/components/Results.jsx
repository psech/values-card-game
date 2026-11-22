import styled from 'styled-components';
import { PILES } from '../game/game';
import Button from './Button';
import { CardFace } from './Card';
import { ArrowLeftIcon, PrintIcon, RestartIcon } from './icons';

const Podium = styled.ol`
  list-style: none;
  margin: 0 auto;
  padding: 0;
  display: grid;
  gap: 18px;
  grid-template-columns: 1fr;
  max-width: 980px;

  @media (min-width: 760px) {
    grid-template-columns: repeat(3, 1fr);
  }

  & > li:first-child > div {
    border-color: var(--gold);
    box-shadow: 0 0 0 1px var(--gold), var(--shadow-md);
  }
`;

const Section = styled.section`
  max-width: 980px;
  margin: 44px auto 0;

  /* On paper, keep each heading on the same page as its cards. */
  @media print {
    break-inside: avoid;
  }
`;

const SectionTitle = styled.h2`
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-muted);
  margin-bottom: 14px;
`;

const List = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
`;

const Summary = styled.p`
  margin-top: 44px;
  text-align: center;
  color: var(--text-muted);
  font-size: 14px;
`;

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  margin-top: 24px;
`;

const Results = ({ piles, cards, total, onBack, onRestart }) => {
  const toCards = (pile) => piles[pile].map((id) => cards[id]);
  const important = total - piles[PILES.less].length;

  return (
    <>
      <Podium aria-label="Your top 3 values">
        {toCards(PILES.top3).map((card, i) => (
          <li key={card.id}>
            <CardFace card={card} variant="featured" rank={i + 1} />
          </li>
        ))}
      </Podium>

      <Section>
        <SectionTitle>Also in your top 5</SectionTitle>
        <List>
          {toCards(PILES.top5).map((card) => (
            <li key={card.id}>
              <CardFace card={card} />
            </li>
          ))}
        </List>
      </Section>

      <Section>
        <SectionTitle>Rounding out your top 8</SectionTitle>
        <List>
          {toCards(PILES.top8).map((card) => (
            <li key={card.id}>
              <CardFace card={card} />
            </li>
          ))}
        </List>
      </Section>

      <Summary>
        You sorted {total} values. {important} mattered to you, and these
        eight came out on top.
      </Summary>
      <Actions data-print-hide>
        <Button $variant="ghost" onClick={onBack}>
          <ArrowLeftIcon /> Change my top 3
        </Button>
        <Button onClick={() => window.print()}>
          <PrintIcon /> Print or save as PDF
        </Button>
        <Button $variant="primary" onClick={onRestart}>
          <RestartIcon /> Play again
        </Button>
      </Actions>
    </>
  );
};

export default Results;
