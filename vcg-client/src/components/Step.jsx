import { Droppable } from 'react-beautiful-dnd';
import styled from 'styled-components';
import Card from './Card';

const Container = styled.div`
  margin: 8px;
  border: 1px solid lightgrey;
  border-radius: 2px;

  width: 100%;

  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
`;

const Title = styled.h3`
  padding: 8px;
`;

const Description = styled.div`
  padding: 8px;
`;

const CardList = styled.div`
  padding: 8px;
  min-height: 50px;

  flex-grow: 1;
  flex-wrap: wrap;
  display: flex;

  justify-content: center;
  align-content: flex-start;

  background-color: ${(props) => (props.isDraggingOver ? 'skyblue' : 'white')};
  transition: background-color 0.5s ease;
`;

const Step = ({ step, cards }) => {
  const noOfCardsToShow = 4;
  const cardsInDeck = cards.length - noOfCardsToShow;
  let cardsToDisplay = cards;
  let descriptionToDisplay = step.description;

  if (step.id === 'step-1') {
    cardsToDisplay = cards.slice(0, noOfCardsToShow);
    descriptionToDisplay = `${step.description} ${
      cardsInDeck >= 0 ? cardsInDeck : 0
    } cards left in the deck.`;
  }

  return (
    <Container>
      <Title>{step.title}</Title>
      <Description>{descriptionToDisplay}</Description>
      <Droppable droppableId={step.id} direction="horizontal">
        {(provided, snapshot) => (
          <CardList
            ref={provided.innerRef}
            {...provided.droppableProps}
            isDraggingOver={snapshot.isDraggingOver}
          >
            {cardsToDisplay.map((card, index) => (
              <Card key={card.id} card={card} index={index} />
            ))}
            {provided.placeholder}
          </CardList>
        )}
      </Droppable>
    </Container>
  );
};

export default Step;
