import { useEffect, useRef, useState } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import styled from 'styled-components';
import { cards, deckOrder } from '../data/initial-data';
import { loadLocalStorage, saveLocalStorage } from '../api/local-storage';
import {
  PHASES,
  RESULT_PHASE,
  canMoveTo,
  createInitialState,
  goBack,
  goNext,
  moveCard,
  phaseStatus,
  restoreState,
  serializeState,
} from '../game/game';
import Button from './Button';
import Header from './Header';
import Results from './Results';
import SelectPhase from './SelectPhase';
import SortPhase from './SortPhase';
import { ArrowLeftIcon, ArrowRightIcon, CheckIcon } from './icons';

const Page = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const Main = styled.main`
  flex: 1;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 36px 20px 48px;
`;

const Intro = styled.div`
  max-width: 620px;
  margin: 0 auto 36px;
  text-align: center;
`;

const Eyebrow = styled.p`
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--accent);
`;

const Title = styled.h1`
  margin-top: 8px;
  font-family: var(--font-display);
  font-weight: 600;
  font-size: clamp(30px, 5vw, 44px);
  line-height: 1.1;
  letter-spacing: -0.02em;
`;

const Lead = styled.p`
  margin-top: 12px;
  font-size: 16px;
  color: var(--text-muted);
`;

const ActionBar = styled.div`
  position: sticky;
  bottom: 0;
  z-index: 10;
  background: var(--surface);
  border-top: 1px solid var(--border);
  box-shadow: 0 -8px 24px -16px rgba(0, 0, 0, 0.25);
`;

const ActionInner = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 12px 20px;
`;

const Hint = styled.p`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 14px;
  text-align: center;
  color: ${({ $complete }) =>
    $complete ? 'var(--accent)' : 'var(--text-muted)'};
  font-weight: ${({ $complete }) => ($complete ? 600 : 400)};
`;

const Footer = styled.footer`
  padding: 28px 20px 32px;
  text-align: center;
  font-size: 12px;
  line-height: 1.7;
  color: var(--text-muted);

  a {
    color: var(--text);
    text-decoration-color: var(--border-strong);
    text-underline-offset: 2px;
  }
`;

const loadInitialState = () =>
  restoreState(loadLocalStorage()) ?? createInitialState();

const App = () => {
  const [state, setState] = useState(loadInitialState);
  const [draggingFrom, setDraggingFrom] = useState(null);
  const isFirstRender = useRef(true);

  const phase = PHASES[state.phase];
  const status = phaseStatus(state);
  const total = deckOrder.length;

  useEffect(() => saveLocalStorage(serializeState(state)), [state]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [state.phase]);

  const onMove = (move) => setState((prev) => moveCard(prev, move));

  const onDragEnd = ({ source, destination, draggableId }) => {
    setDraggingFrom(null);
    if (!destination) return;
    onMove({
      cardId: draggableId,
      from: source.droppableId,
      to: destination.droppableId,
      index: destination.index,
    });
  };

  const restart = () => {
    if (window.confirm('Start over? Your progress will be lost.')) {
      setState(createInitialState());
    }
  };

  const isTargetFull =
    !!phase.target &&
    draggingFrom !== null &&
    !canMoveTo(state, draggingFrom, phase.target);

  const isResult = state.phase === RESULT_PHASE;

  return (
    <Page>
      <Header onRestart={restart} />
      <Main>
        <Intro>
          <Eyebrow>
            {isResult
              ? 'Your result'
              : `Round ${state.phase + 1}`}
          </Eyebrow>
          <Title>{phase.title}</Title>
          <Lead>{phase.description}</Lead>
        </Intro>

        <DragDropContext
          onDragStart={({ source }) => setDraggingFrom(source.droppableId)}
          onDragEnd={onDragEnd}
        >
          {phase.id === 'sort' && (
            <SortPhase
              piles={state.piles}
              cards={cards}
              total={total}
              onMove={onMove}
            />
          )}
          {phase.target && (
            <SelectPhase
              phase={phase}
              piles={state.piles}
              cards={cards}
              isTargetFull={isTargetFull}
              onMove={onMove}
            />
          )}
        </DragDropContext>

        {isResult && (
          <Results
            piles={state.piles}
            cards={cards}
            total={total}
            onBack={() => setState(goBack)}
            onRestart={restart}
          />
        )}
      </Main>

      {!isResult && (
        <ActionBar>
          <ActionInner>
            <Button
              $variant="ghost"
              onClick={() => setState(goBack)}
              disabled={state.phase === 0}
            >
              <ArrowLeftIcon /> Back
            </Button>
            <Hint $complete={status.complete} role="status">
              {status.complete && <CheckIcon size={16} />}
              {status.hint}
            </Hint>
            <Button
              $variant="primary"
              onClick={() => setState(goNext)}
              disabled={!status.complete}
            >
              {state.phase === RESULT_PHASE - 1 ? 'See results' : 'Continue'}
              <ArrowRightIcon />
            </Button>
          </ActionInner>
        </ActionBar>
      )}

      <Footer>
        Copyright &copy; The John Maxwell Company ·{' '}
        <a href="https://www.johnmaxwell.com/" target="_blank" rel="noreferrer">
          www.johnmaxwell.com
        </a>
        <br />
        Designed and developed by Przemek Sech ·{' '}
        <a
          href="https://www.linkedin.com/in/przemyslaw-sech/"
          target="_blank"
          rel="noreferrer"
        >
          LinkedIn
        </a>
      </Footer>
    </Page>
  );
};

export default App;
