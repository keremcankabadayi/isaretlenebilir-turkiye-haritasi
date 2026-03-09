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

const AddColorRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
`;

const ColorPreview = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: ${props => props.color};
  border: 2px solid #e0e0e0;
  cursor: pointer;
  position: relative;
  flex-shrink: 0;
`;

const ColorPickerInput = styled.input`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
`;

const MeaningInput = styled.input`
  flex: 1;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  padding: 10px;
  font-size: 14px;
  outline: none;
  box-sizing: border-box;

  &:focus {
    border-color: #4B89DC;
  }
`;

const ContextMenu = styled.div`
  position: fixed;
  z-index: 1000;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
  overflow: hidden;
  min-width: 160px;
`;

const ContextMenuItem = styled.div`
  padding: 10px 16px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background: #f0f4ff;
  }
`;

const NoteTooltip = styled.div`
  position: fixed;
  z-index: 999;
  background: rgba(0,0,0,0.85);
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 13px;
  max-width: 220px;
  word-wrap: break-word;
  pointer-events: none;
  white-space: pre-wrap;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.4);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  width: 360px;
  box-shadow: 0 8px 30px rgba(0,0,0,0.2);
`;

const ModalTitle = styled.div`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 12px;
`;

const ModalTextarea = styled.textarea`
  width: 100%;
  min-height: 80px;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  padding: 10px;
  font-size: 14px;
  resize: vertical;
  outline: none;
  box-sizing: border-box;

  &:focus {
    border-color: #4B89DC;
  }
`;

const ModalButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 12px;
`;

const ModalButton = styled.button`
  padding: 8px 18px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  background: ${props => props.danger ? '#e74c3c' : props.primary ? '#4B89DC' : '#f0f0f0'};
  color: ${props => (props.primary || props.danger) ? 'white' : '#333'};

  &:hover {
    opacity: 0.9;
  }
`;

const ConfirmText = styled.p`
  font-size: 14px;
  color: #444;
  margin: 0 0 4px 0;
  line-height: 1.5;
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const Map = () => {
  const svgRef = useRef(null);
  const fileInputRef = useRef(null);
  const [selectedColor, setSelectedColor] = useState('#A4907C');
  const [title, setTitle] = useState('');
  const [coloredCities, setColoredCities] = useState(() => {
    const saved = localStorage.getItem('coloredCities');
    return saved ? JSON.parse(saved) : {};
  });
  const [cityNotes, setCityNotes] = useState(() => {
    const saved = localStorage.getItem('cityNotes');
    return saved ? JSON.parse(saved) : {};
  });
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, cityId: null });
  const [noteModal, setNoteModal] = useState({ visible: false, cityId: null, note: '' });
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, text: '' });
  const [colorModal, setColorModal] = useState({ visible: false, color: '#8E44AD', meaning: '', editingColor: null });
  const [deleteConfirm, setDeleteConfirm] = useState({ visible: false, color: null, meaning: '' });
  const [colorMeanings, setColorMeanings] = useState(() => {
    const saved = localStorage.getItem('colorMeanings');
    return saved ? JSON.parse(saved) : [
      { color: '#A4907C', meaning: 'Anlam 1' },
      { color: '#4B89DC', meaning: 'Anlam 2' },
      { color: '#90B77D', meaning: 'Anlam 3' }
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
    localStorage.setItem('cityNotes', JSON.stringify(cityNotes));
  }, [cityNotes]);

  useEffect(() => {
    const handleClick = () => setContextMenu(prev => ({ ...prev, visible: false }));
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

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
              const currentColor = coloredCities[cityId];
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

            path.oncontextmenu = (e) => {
              e.preventDefault();
              setContextMenu({ visible: true, x: e.clientX, y: e.clientY, cityId });
            };

            path.onmousemove = (e) => {
              const note = cityNotes[cityId];
              if (note) {
                setTooltip({ visible: true, x: e.clientX + 12, y: e.clientY + 12, text: note });
              }
            };

            path.onmouseleave = () => {
              setTooltip(prev => ({ ...prev, visible: false }));
            };
          });
        }
      })
      .catch(error => {
        console.error('SVG yüklenirken hata oluştu:', error);
      });
  }, [selectedColor, coloredCities, cityNotes]);

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
      const legendPadding = Math.max(100, colorMeanings.length * 28 + 40);
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

  const handleExport = () => {
    const data = { title, coloredCities, colorMeanings, cityNotes };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.download = 'turkiye-haritasi.json';
    link.href = URL.createObjectURL(blob);
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const handleImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        if (data.title !== undefined) setTitle(data.title);
        if (data.colorMeanings) setColorMeanings(data.colorMeanings);
        if (data.coloredCities) setColoredCities(data.coloredCities);
        if (data.cityNotes) setCityNotes(data.cityNotes);
        if (data.colorMeanings?.length > 0) setSelectedColor(data.colorMeanings[0].color);
      } catch {
        alert('Geçersiz dosya formatı');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const openNoteModal = (cityId) => {
    setContextMenu(prev => ({ ...prev, visible: false }));
    setNoteModal({ visible: true, cityId, note: cityNotes[cityId] || '' });
  };

  const saveNote = () => {
    const { cityId, note } = noteModal;
    if (note.trim()) {
      setCityNotes(prev => ({ ...prev, [cityId]: note.trim() }));
    } else {
      setCityNotes(prev => {
        const newState = { ...prev };
        delete newState[cityId];
        return newState;
      });
    }
    setNoteModal({ visible: false, cityId: null, note: '' });
  };

  const deleteNote = () => {
    const { cityId } = noteModal;
    setCityNotes(prev => {
      const newState = { ...prev };
      delete newState[cityId];
      return newState;
    });
    setNoteModal({ visible: false, cityId: null, note: '' });
  };

  const closeColorModal = () => {
    setColorModal({ visible: false, color: '#8E44AD', meaning: '', editingColor: null });
  };

  const openAddColorModal = () => {
    setColorModal({ visible: true, color: '#8E44AD', meaning: '', editingColor: null });
  };

  const openEditColorModal = (color) => {
    const item = colorMeanings.find(i => i.color === color);
    if (!item) return;
    setColorModal({ visible: true, color: item.color, meaning: item.meaning, editingColor: color });
  };

  const saveColor = () => {
    const { color, meaning, editingColor } = colorModal;
    const label = meaning.trim() || `Anlam ${colorMeanings.length + 1}`;

    if (editingColor) {
      const duplicate = color.toLowerCase() !== editingColor.toLowerCase() &&
        colorMeanings.some(item => item.color.toLowerCase() === color.toLowerCase());
      if (duplicate) { closeColorModal(); return; }

      setColorMeanings(prev =>
        prev.map(item => item.color === editingColor ? { color, meaning: label } : item)
      );
      setColoredCities(prev => {
        const newState = {};
        Object.entries(prev).forEach(([cityId, cityColor]) => {
          newState[cityId] = cityColor === editingColor ? color : cityColor;
        });
        return newState;
      });
      if (selectedColor === editingColor) setSelectedColor(color);
    } else {
      const exists = colorMeanings.some(item => item.color.toLowerCase() === color.toLowerCase());
      if (exists) { closeColorModal(); return; }
      setColorMeanings(prev => [...prev, { color, meaning: label }]);
      setSelectedColor(color);
    }
    closeColorModal();
  };

  const askRemoveColor = (color) => {
    const item = colorMeanings.find(i => i.color === color);
    setDeleteConfirm({ visible: true, color, meaning: item?.meaning || '' });
  };

  const confirmRemoveColor = () => {
    const { color } = deleteConfirm;
    setColorMeanings(prev => prev.filter(item => item.color !== color));
    setColoredCities(prev => {
      const newState = {};
      Object.entries(prev).forEach(([cityId, cityColor]) => {
        if (cityColor !== color) newState[cityId] = cityColor;
      });
      return newState;
    });
    if (selectedColor === color) {
      setSelectedColor(colorMeanings.find(item => item.color !== color)?.color || '#A4907C');
    }
    setDeleteConfirm({ visible: false, color: null, meaning: '' });
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
        onExport={handleExport}
        onImport={() => fileInputRef.current?.click()}
        colorMeanings={colorMeanings}
        onAddColorClick={openAddColorModal}
        onRemoveColor={askRemoveColor}
        onEditColor={openEditColorModal}
      />
      <HiddenFileInput
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleImport}
      />
      <div ref={svgRef} />
      <VersionText>v{packageJson.version}</VersionText>

      {contextMenu.visible && (
        <ContextMenu style={{ left: contextMenu.x, top: contextMenu.y }}>
          <ContextMenuItem onClick={() => openNoteModal(contextMenu.cityId)}>
            📝 {cityNotes[contextMenu.cityId] ? 'Notu Düzenle' : 'Not Ekle'}
          </ContextMenuItem>
          {cityNotes[contextMenu.cityId] && (
            <ContextMenuItem onClick={() => {
              setCityNotes(prev => {
                const newState = { ...prev };
                delete newState[contextMenu.cityId];
                return newState;
              });
              setContextMenu(prev => ({ ...prev, visible: false }));
            }}>
              🗑️ Notu Sil
            </ContextMenuItem>
          )}
        </ContextMenu>
      )}

      {tooltip.visible && (
        <NoteTooltip style={{ left: tooltip.x, top: tooltip.y }}>
          {tooltip.text}
        </NoteTooltip>
      )}

      {colorModal.visible && (
        <ModalOverlay onClick={closeColorModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalTitle>{colorModal.editingColor ? 'Rengi Düzenle' : 'Yeni Renk Ekle'}</ModalTitle>
            <AddColorRow>
              <ColorPreview color={colorModal.color} title="Renk seç">
                <ColorPickerInput
                  type="color"
                  value={colorModal.color}
                  onChange={(e) => setColorModal(prev => ({ ...prev, color: e.target.value }))}
                />
              </ColorPreview>
              <MeaningInput
                autoFocus
                value={colorModal.meaning}
                onChange={(e) => setColorModal(prev => ({ ...prev, meaning: e.target.value }))}
                placeholder="Anlam girin..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    saveColor();
                  }
                }}
              />
            </AddColorRow>
            <ModalButtons>
              <ModalButton onClick={closeColorModal}>İptal</ModalButton>
              <ModalButton primary onClick={saveColor}>
                {colorModal.editingColor ? 'Kaydet' : 'Ekle'}
              </ModalButton>
            </ModalButtons>
          </ModalContent>
        </ModalOverlay>
      )}

      {noteModal.visible && (
        <ModalOverlay onClick={() => setNoteModal({ visible: false, cityId: null, note: '' })}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalTitle>📝 Not Ekle</ModalTitle>
            <ModalTextarea
              autoFocus
              value={noteModal.note}
              onChange={(e) => setNoteModal(prev => ({ ...prev, note: e.target.value }))}
              placeholder="Notunuzu buraya yazın..."
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  saveNote();
                }
              }}
            />
            <ModalButtons>
              {cityNotes[noteModal.cityId] && (
                <ModalButton onClick={deleteNote}>Sil</ModalButton>
              )}
              <ModalButton onClick={() => setNoteModal({ visible: false, cityId: null, note: '' })}>
                İptal
              </ModalButton>
              <ModalButton primary onClick={saveNote}>Kaydet</ModalButton>
            </ModalButtons>
          </ModalContent>
        </ModalOverlay>
      )}
      {deleteConfirm.visible && (
        <ModalOverlay onClick={() => setDeleteConfirm({ visible: false, color: null, meaning: '' })}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalTitle>Rengi Sil</ModalTitle>
            <ConfirmText>
              <strong>{deleteConfirm.meaning}</strong> rengini silmek istediğinize emin misiniz? Bu renkle boyanmış tüm şehirler temizlenecektir.
            </ConfirmText>
            <ModalButtons>
              <ModalButton onClick={() => setDeleteConfirm({ visible: false, color: null, meaning: '' })}>
                İptal
              </ModalButton>
              <ModalButton danger onClick={confirmRemoveColor}>Sil</ModalButton>
            </ModalButtons>
          </ModalContent>
        </ModalOverlay>
      )}
    </MapContainer>
  );
};

export default Map;