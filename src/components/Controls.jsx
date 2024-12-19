import React from 'react';
import styled from 'styled-components';

const ControlsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const ColorButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
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

const ActionButton = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  background-color: #f0f0f0;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background-color: #e0e0e0;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
`;

const Controls = ({ selectedColor, onColorSelect, onClear, onSave }) => {
  return (
    <ControlsContainer>
      <ColorButtons>
        <ColorButton 
          color="#A4907C"
          isSelected={selectedColor === '#A4907C'}
          onClick={() => onColorSelect('#A4907C')}
        />
        <ColorButton 
          color="#FFF4CF"
          isSelected={selectedColor === '#FFF4CF'}
          onClick={() => onColorSelect('#FFF4CF')}
        />
        <ColorButton 
          color="#4B89DC"
          isSelected={selectedColor === '#4B89DC'}
          onClick={() => onColorSelect('#4B89DC')}
        />
        <ColorButton 
          color="#90B77D"
          isSelected={selectedColor === '#90B77D'}
          onClick={() => onColorSelect('#90B77D')}
        />
        <ColorButton 
          color="#FAA0A0"
          isSelected={selectedColor === '#FAA0A0'}
          onClick={() => onColorSelect('#FAA0A0')}
        />
      </ColorButtons>
      <ButtonGroup>
        <ActionButton onClick={onClear}>
          Haritayı Temizle
        </ActionButton>
        <ActionButton onClick={onSave}>
          JPG Olarak Kaydet
        </ActionButton>
      </ButtonGroup>
    </ControlsContainer>
  );
};

export default Controls; 