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
  flex-wrap: wrap;
  max-width: 90%;
`;

const ColorButtonWrapper = styled.div`
  position: relative;
  display: inline-flex;
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
    z-index: 10;
  }

  &:hover {
    transform: scale(1.1);
  }
`;

const RemoveButton = styled.button`
  position: absolute;
  top: -6px;
  right: -6px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: none;
  background: #e74c3c;
  color: white;
  font-size: 11px;
  line-height: 1;
  cursor: pointer;
  display: none;
  align-items: center;
  justify-content: center;
  z-index: 5;
  padding: 0;

  ${ColorButtonWrapper}:hover & {
    display: flex;
  }
`;

const AddButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px dashed #ccc;
  background: transparent;
  cursor: pointer;
  font-size: 22px;
  color: #999;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    border-color: #4B89DC;
    color: #4B89DC;
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

const Controls = ({ selectedColor, onColorSelect, onClear, onSave, onExport, onImport, colorMeanings, onAddColorClick, onRemoveColor, onEditColor }) => {
  return (
    <ControlsContainer>
      <ColorButtons>
        {colorMeanings.map((item, index) => (
          <ColorButtonWrapper key={index}>
            <ColorButton
              color={item.color}
              meaning={item.meaning}
              isSelected={selectedColor === item.color}
              onClick={() => {
                if (selectedColor === item.color) {
                  onEditColor(item.color);
                } else {
                  onColorSelect(item.color);
                }
              }}
            />
            {colorMeanings.length > 1 && (
              <RemoveButton onClick={(e) => {
                e.stopPropagation();
                onRemoveColor(item.color);
              }}>
                ×
              </RemoveButton>
            )}
          </ColorButtonWrapper>
        ))}
        <AddButton onClick={onAddColorClick} title="Yeni renk ekle">
          +
        </AddButton>
      </ColorButtons>
      <ButtonGroup>
        <ActionButton onClick={onClear}>
          Haritayı Temizle
        </ActionButton>
        <ActionButton onClick={onSave}>
          JPG Kaydet
        </ActionButton>
        <ActionButton onClick={onExport}>
          Dışa Aktar
        </ActionButton>
        <ActionButton onClick={onImport}>
          İçe Aktar
        </ActionButton>
      </ButtonGroup>
    </ControlsContainer>
  );
};

export default Controls;
