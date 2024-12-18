import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import Controls from './Controls';
import packageJson from '../../package.json';

const MapContainer = styled.div`
  background-color: white;
  padding: 1rem;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  position: relative;
`;

const VersionText = styled.div`
  position: absolute;
  bottom: 10px;
  right: 10px;
  font-size: 12px;
  color: #666;
`;

const Map = () => {
  const svgRef = useRef(null);
  const [selectedColor, setSelectedColor] = useState('#4B89DC');
  const [coloredCities, setColoredCities] = useState(() => {
    const saved = localStorage.getItem('coloredCities');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem('coloredCities', JSON.stringify(coloredCities));
  }, [coloredCities]);

  useEffect(() => {
    // SVG'yi yükle
    fetch(`${process.env.PUBLIC_URL}/turkey-map.svg`)
      .then(response => response.text())
      .then(svgText => {
        // SVG'yi DOM'a ekle
        if (svgRef.current) {
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
        }
      })
      .catch(error => {
        console.error('SVG yüklenirken hata oluştu:', error);
      });
  }, [selectedColor, coloredCities]);

  const handleClear = () => {
    // Tüm boyamaları temizle
    setColoredCities({});
    localStorage.removeItem('coloredCities');
    
    // SVG'deki tüm path'leri temizle
    const paths = svgRef.current?.querySelectorAll('path.st0');
    paths?.forEach(path => {
      path.style.fill = 'transparent';
    });
  };

  const handleSave = () => {
    // SVG'yi JPG olarak kaydet
    const svg = svgRef.current?.querySelector('svg');
    if (!svg) return;

    // SVG'yi data URL'e çevir
    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], {type: 'image/svg+xml;charset=utf-8'});
    const url = URL.createObjectURL(svgBlob);

    // SVG'yi canvas'a çiz
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = svg.clientWidth;
      canvas.height = svg.clientHeight;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);

      // Canvas'ı JPG olarak indir
      const link = document.createElement('a');
      link.download = 'turkiye-haritasi.jpg';
      link.href = canvas.toDataURL('image/jpeg');
      link.click();
    };
    img.src = url;
  };

  return (
    <MapContainer>
      <Controls 
        selectedColor={selectedColor}
        onColorSelect={setSelectedColor}
        onClear={handleClear}
        onSave={handleSave}
      />
      <div ref={svgRef} />
      <VersionText>v{packageJson.version}</VersionText>
    </MapContainer>
  );
};

export default Map;