import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import Controls from './Controls';
import packageJson from '../../package.json';

const MapContainer = styled.div`
  background-color: white;
  padding: 0.25rem;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  position: relative;
`;

const TitleInput = styled.input`
  width: 100%;
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  padding: 0.25rem;
  margin-bottom: 0.25rem;
  border: 2px solid #e0e0e0;
  border-radius: 5px;
  outline: none;
  background: #f8f8f8;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);

  &:hover {
    border-color: #ccc;
    background: #fff;
  }

  &:focus {
    border-color: #4B89DC;
    background: #fff;
    box-shadow: 0 1px 3px rgba(75,137,220,0.2);
  }
`;

const VersionText = styled.div`
  position: absolute;
  bottom: 5px;
  right: 10px;
  font-size: 12px;
  color: #666;
`;

const ColorLegend = styled.div`
  position: absolute;
  bottom: 5px;
  left: 10px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  background: rgba(255, 255, 255, 0.9);
  padding: 5px;
  border-radius: 5px;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #666;
`;

const ColorBox = styled.div`
  width: 15px;
  height: 15px;
  border-radius: 3px;
  background-color: ${props => props.color};
`;

const Map = () => {
  const svgRef = useRef(null);
  const [selectedColor, setSelectedColor] = useState('#A4907C');
  const [title, setTitle] = useState('');
  const [coloredCities, setColoredCities] = useState(() => {
    const saved = localStorage.getItem('coloredCities');
    return saved ? JSON.parse(saved) : {};
  });
  const [colorMeanings, setColorMeanings] = useState(() => {
    const saved = localStorage.getItem('colorMeanings');
    return saved ? JSON.parse(saved) : [
      { color: '#A4907C', meaning: 'Anlam 1' },
      { color: '#FFF4CF', meaning: 'Anlam 2' },
      { color: '#4B89DC', meaning: 'Anlam 3' },
      { color: '#90B77D', meaning: 'Anlam 4' },
      { color: '#FAA0A0', meaning: 'Anlam 5' }
    ];
  });

  useEffect(() => {
    const savedTitle = localStorage.getItem('mapTitle');
    if (savedTitle) {
      setTitle(savedTitle);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('mapTitle', title);
  }, [title]);

  useEffect(() => {
    localStorage.setItem('coloredCities', JSON.stringify(coloredCities));
  }, [coloredCities]);

  useEffect(() => {
    localStorage.setItem('colorMeanings', JSON.stringify(colorMeanings));
  }, [colorMeanings]);

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
    const svg = svgRef.current?.querySelector('svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], {type: 'image/svg+xml;charset=utf-8'});
    const url = URL.createObjectURL(svgBlob);

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const padding = 60; // Başlık için üst padding
      const legendPadding = 150; // 100'den 150'ye çıkardık - Renk açıklamaları için alt padding
      canvas.width = svg.clientWidth;
      canvas.height = svg.clientHeight + padding + legendPadding;
      const ctx = canvas.getContext('2d');
      
      // Arka plan
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Başlık
      ctx.font = 'bold 24px Arial';
      ctx.fillStyle = 'black';
      ctx.textAlign = 'center';
      ctx.fillText(title || 'Türkiye Haritası', canvas.width / 2, 35);
      
      // SVG
      ctx.drawImage(img, 0, padding);

      // Renk açıklamaları
      ctx.font = '12px Arial';
      ctx.textAlign = 'left';
      let yOffset = canvas.height - legendPadding + 30; // 20'den 30'a çıkardık - Biraz daha yukarıdan başlasın
      
      colorMeanings.forEach((item, index) => {
        // Renk kutusu
        ctx.fillStyle = item.color;
        ctx.fillRect(20, yOffset + (index * 25), 15, 15); // 20'den 25'e çıkardık - Satır aralığını artırdık
        
        // Açıklama metni
        ctx.fillStyle = '#666';
        ctx.fillText(item.meaning, 45, yOffset + (index * 25) + 12);
      });

      // İndir
      const link = document.createElement('a');
      link.download = 'turkiye-haritasi.jpg';
      link.href = canvas.toDataURL('image/jpeg');
      link.click();
    };
    img.src = url;
  };

  // Renk anlamını güncelle
  const updateColorMeaning = (color, newMeaning) => {
    setColorMeanings(prev => 
      prev.map(item => 
        item.color === color ? { ...item, meaning: newMeaning } : item
      )
    );
  };

  return (
    <MapContainer>
      <TitleInput
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Başlık"
      />
      <Controls 
        selectedColor={selectedColor}
        onColorSelect={setSelectedColor}
        onClear={handleClear}
        onSave={handleSave}
        colorMeanings={colorMeanings}
      />
      <div ref={svgRef} />
      <ColorLegend>
        {colorMeanings.map((item, index) => (
          <LegendItem key={index}>
            <ColorBox color={item.color} />
            <input
              value={item.meaning}
              onChange={(e) => updateColorMeaning(item.color, e.target.value)}
              style={{
                border: 'none',
                background: 'transparent',
                fontSize: '14px',
                color: '#666',
                width: '120px'
              }}
            />
          </LegendItem>
        ))}
      </ColorLegend>
      <VersionText>v{packageJson.version}</VersionText>
    </MapContainer>
  );
};

export default Map;