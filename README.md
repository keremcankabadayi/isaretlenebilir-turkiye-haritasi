# İşaretlenebilir Türkiye Haritası

Türkiye haritasını renklendirme uygulaması.

## Özellikler

- Dinamik renk paleti: istediğin rengi ekle, düzenle, sil
- Şehirlere not ekleme (sağ tık)
- Haritayı JPG olarak kaydetme
- Harita verisini JSON olarak dışa/içe aktarma
- Tüm veriler tarayıcıda kalıcı olarak saklanır

## Kurulum

```bash
npm install
```

## Geliştirme

```bash
npm start
```

Tarayıcıda `http://localhost:3000` adresinde açılır.

## GitHub Pages'e Yayınlama

Tek komutla deploy:

```bash
npm run deploy
```

Bu komut sırasıyla:

1. `npm run build` ile production build alır
2. `build` klasörünü `gh-pages` branch'ine push eder

Yayınlandıktan sonra buradan erişilebilir:

https://keremcankabadayi.github.io/isaretlenebilir-turkiye-haritasi/

![Shottr 2024-12-19 00 41 04](https://github.com/user-attachments/assets/6a987af8-eb22-47ad-9711-80d1cf10618e)
