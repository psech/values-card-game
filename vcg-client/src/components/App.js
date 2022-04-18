import { useState, useEffect } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import styled from 'styled-components';
import initialData from '../data/initial-data';
import {
  loadLocalStorage,
  resetLocalStorage,
  saveLocalStorage,
} from '../api/local-storage';
import Step from './Step';

const StepGroup = styled.div`
  padding: 8px;
  margin-bottom: 20px;

  display: flex;
`;

const Header = styled.div`
  margin: 8px;
  padding: 8px;
  border: 1px solid lightgrey;
  border-radius: 2px;

  background-color: WhiteSmoke;
  position: sticky;
  top: 0;

  display: flex;
  justify-content: space-between;
`;

const NextStepButton = styled.button`
  background-color: #4caf50; /* Green */
  border: none;
  border-radius: 8px;
  color: white;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  width: 80%;
  margin-bottom: 30px;
`;

const Footer = styled.div`
  height: 80px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

const App = () => {
  const [state, setState] = useState(() => loadLocalStorage(initialData));

  const onDragEnd = (result) => {
    const { source, destination, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const start = state.steps[source.droppableId];
    const finish = state.steps[destination.droppableId];

    if (start === finish) {
      const newCardIds = [...start.cardIds];
      newCardIds.splice(source.index, 1);
      newCardIds.splice(destination.index, 0, draggableId);

      const newStep = {
        ...start,
        cardIds: newCardIds,
      };

      setState((prevState) => ({
        ...prevState,
        steps: {
          ...prevState.steps,
          [newStep.id]: newStep,
        },
      }));

      return;
    }

    // Moving from one list to another
    const startCardIds = Array.from(start.cardIds);
    startCardIds.splice(source.index, 1);
    const newStart = {
      ...start,
      cardIds: startCardIds,
    };

    const finishCardIds = Array.from(finish.cardIds);
    finishCardIds.splice(destination.index, 0, draggableId);
    const newFinish = {
      ...finish,
      cardIds: finishCardIds,
    };

    setState((prevState) => ({
      ...prevState,
      steps: {
        ...prevState.steps,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish,
      },
    }));
  };

  const nextStep = () => {
    setState((prevState) => ({
      ...prevState,
      currentStep: prevState.currentStep + 1,
    }));
  };

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.body.scrollHeight,
      left: 0,
      behavior: 'smooth',
    });
  };

  const resetApplication = () => {
    resetLocalStorage();
    window.location.reload();
  };

  useEffect(() => {
    scrollToBottom();
  }, [state.currentStep]);

  useEffect(() => saveLocalStorage(state), [state]);

  return (
    <>
      <Header>
        <h1>Values Card Game</h1>
        <button onClick={resetApplication}>Reset</button>
      </Header>
      <DragDropContext onDragEnd={onDragEnd}>
        {Object.keys(state.stepGroups).map((stepGroupId, index) => {
          if (index > state.currentStep) {
            return true;
          }

          return (
            <StepGroup key={stepGroupId}>
              {state.stepGroups[stepGroupId].steps.map((stepId) => {
                const step = state.steps[stepId];
                const cards = step.cardIds.map((cardId) => state.cards[cardId]);

                return <Step key={step.id} step={step} cards={cards} />;
              })}
            </StepGroup>
          );
        })}
      </DragDropContext>

      <Footer>
        {state.currentStep < Object.keys(state.stepGroups).length - 1 && (
          <NextStepButton onClick={nextStep}>Next</NextStepButton>
        )}
        <span>
          Copyright &copy; The John Maxwell Company{' '}
          <a
            href="https://www.johnmaxwell.com/"
            target="_blank"
            rel="noreferrer"
          >
            www.johnmaxwell.com
          </a>
          <br />
          Designed and developed by Przemek Sech{' '}
          <a
            href="https://www.linkedin.com/in/przemyslaw-sech/"
            target="_blank"
            rel="noreferrer"
          >
            LinkedIn
          </a>
        </span>
      </Footer>
    </>
  );
};

export default App;
