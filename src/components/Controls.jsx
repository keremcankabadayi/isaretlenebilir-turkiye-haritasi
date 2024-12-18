import React from 'react';
import styled from 'styled-components';

const ControlsContainer = styled.div`
  background-color: white;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  margin-bottom: 2rem;
`;

const ColorContainer = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

const ColorButton = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  background-color: ${props => props.color};
  transition: transform 0.2s;
  outline: ${props => props.$isActive ? '3px solid #007bff' : 'none'};
  outline-offset: 2px;

  &:hover {
    transform: scale(1.1);
  }
`;

const COLORS = [
  '#FF6B6B',  // Kırmızı
  '#4ECDC4',  // Turkuaz
  '#45B7D1',  // Mavi
  '#96CEB4',  // Yeşil
  '#FFEEAD',  // Sarı
  '#D4A5A5',  // Pembe
  '#9B59B6',  // Mor
  '#E67E22',  // Turuncu
];

const Controls = ({ activeColor, onColorSelect }) => {
  return (
    <ControlsContainer>
      <ColorContainer>
        {COLORS.map((color, index) => (
          <ColorButton
            key={index}
            color={color}
            $isActive={activeColor === color}
            onClick={() => onColorSelect(color)}
            role="button"
            aria-label={`Select color ${color}`}
          />
        ))}
      </ColorContainer>
    </ControlsContainer>
  );
};

export default Controls; 