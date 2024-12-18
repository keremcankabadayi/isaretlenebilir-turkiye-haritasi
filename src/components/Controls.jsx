import React from 'react';
import styled from 'styled-components';

const ControlsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const ColorButton = styled.button`
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  background-color: ${props => props.color};
  border: 2px solid ${props => props.isSelected ? '#000' : 'transparent'};

  &:hover {
    transform: scale(1.1);
  }
`;

const Controls = ({ selectedColor, onColorSelect }) => {
  return (
    <ControlsContainer>
      <ColorButton 
        color="green"
        isSelected={selectedColor === 'green'}
        onClick={() => onColorSelect('green')}
      />
      <ColorButton 
        color="red"
        isSelected={selectedColor === 'red'}
        onClick={() => onColorSelect('red')}
      />
    </ControlsContainer>
  );
};

export default Controls; 