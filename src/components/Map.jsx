import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';

const MapContainer = styled.div`
  background-color: white;
  padding: 1rem;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  
  svg {
    width: 100%;
    height: auto;
  }
`;

const Map = () => {
  const svgRef = useRef(null);

  useEffect(() => {
    // SVG'yi yükle
    fetch(process.env.PUBLIC_URL + '/turkey-map.svg')
      .then(response => response.text())
      .then(svgText => {
        // SVG'yi DOM'a ekle
        svgRef.current.innerHTML = svgText;

        // Tüm illere tıklama olayı ekle
        const paths = svgRef.current.querySelectorAll('path.st0');
        paths.forEach(path => {
          // Başlangıç stilleri
          path.style.cursor = 'pointer';
          path.style.fill = 'transparent';
          
          path.onclick = () => {
            // Şu anki rengi kontrol et
            const currentColor = path.style.fill;
            
            // Eğer yeşilse şeffaf yap, değilse yeşile boya
            if (currentColor === 'green') {
              path.style.fill = 'transparent';
            } else {
              path.style.fill = 'green';
            }
          };
        });
      });
  }, []);

  return (
    <MapContainer>
      <div ref={svgRef} />
    </MapContainer>
  );
};

export default Map;