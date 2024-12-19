import React from 'react';
import styled from 'styled-components';

const ControlsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  margin-bottom: 0;
`;

const ColorButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
`;

const ColorButton = styled.button`
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  background-color: ${props => props.color};
  border: 2px solid ${props => props.isSelected ? '#000' : 'transparent'};
  position: relative;

  &:hover::after {
    content: '${props => props.meaning}';
    position: absolute;
    bottom: -25px;
    left: 50%;
    transform: translateX(-50%);
    white-space: nowrap;
    background: rgba(0,0,0,0.8);
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
  }

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
  gap: 0.5rem;
`;

const Controls = ({ selectedColor, onColorSelect, onClear, onSave, colorMeanings }) => {
  return (
    <ControlsContainer>
      <ColorButtons>
        {colorMeanings.map((item, index) => (
          <ColorButton 
            key={index}
            color={item.color}
            meaning={item.meaning}
            isSelected={selectedColor === item.color}
            onClick={() => onColorSelect(item.color)}
          />
        ))}
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