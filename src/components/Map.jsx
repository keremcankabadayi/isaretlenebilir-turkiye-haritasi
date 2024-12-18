import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import Controls from './Controls';

const MapContainer = styled.div`
  background-color: white;
  padding: 1rem;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
`;

const Map = () => {
  const svgRef = useRef(null);
  const [selectedColor, setSelectedColor] = useState('green');
  const [coloredCities, setColoredCities] = useState({});

  useEffect(() => {
    // SVG'yi yükle
    fetch('./turkey-map.svg')
      .then(response => response.text())
      .then(svgText => {
        // SVG'yi DOM'a ekle
        svgRef.current.innerHTML = svgText;

        // Tüm illere tıklama olayı ekle
        const paths = svgRef.current.querySelectorAll('path.st0');
        paths.forEach((path, index) => {
          const cityId = `city-${index}`;
          path.id = cityId;
          
          // Başlangıç stilleri
          path.style.cursor = 'pointer';
          path.style.fill = coloredCities[cityId] || 'transparent';
          
          path.onclick = () => {
            // Şu anki rengi kontrol et
            const currentColor = coloredCities[cityId];
            
            // Eğer aynı renkse şeffaf yap, değilse seçili renge boya
            if (currentColor === selectedColor) {
              setColoredCities(prev => {
                const newState = { ...prev };
                delete newState[cityId];
                return newState;
              });
              path.style.fill = 'transparent';
            } else {
              setColoredCities(prev => ({
                ...prev,
                [cityId]: selectedColor
              }));
              path.style.fill = selectedColor;
            }
          };
        });
      });
  }, [selectedColor, coloredCities]);

  return (
    <MapContainer>
      <Controls 
        selectedColor={selectedColor}
        onColorSelect={setSelectedColor}
      />
      <div ref={svgRef} />
    </MapContainer>
  );
};

export default Map;