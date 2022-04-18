import { Draggable } from 'react-beautiful-dnd';
import styled from 'styled-components';

const Container = styled.div`
  border: 1px solid lightgrey;
  border-radius: 10px;
  padding: 8px;
  margin: 8px;

  background-color: ${(props) => (props.isDragging ? 'lightgreen' : 'white')};

  width: 300px;
  height: 100px;
`;
const Title = styled.h3`
  padding: 8px;
  text-align: center;
`;
const Description = styled.div`
  padding: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  min-height: 50px;
`;

const Card = ({ card, index }) => {
  return (
    <Draggable draggableId={card.id} index={index}>
      {(provided, snapshot) => (
        <Container
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          isDragging={snapshot.isDragging}
        >
          <Title>{card.title}</Title>
          <Description>{card.description}</Description>
        </Container>
      )}
    </Draggable>
  );
};

export default Card;
