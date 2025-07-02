# 📝 Notera - Modern Not Alma Uygulaması

![npm](https://img.shields.io/badge/npm-%23000000.svg?style=for-the-badge&logo=npm&logoColor=white)
![Electron](https://img.shields.io/badge/Electron-%2300BFFF.svg?style=for-the-badge&logo=electron&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-%23F7DF1E.svg?style=for-the-badge&logo=javascript&logoColor=black)
![HTML5](https://img.shields.io/badge/HTML5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)

## Proje Hakkında
Bu proje Electron ile geliştirilmiş basit bir not uygulamasıdır. npm paket yöneticisi kullanılarak kurulmuştur.

...


Notera, sade ve modern bir masaüstü not alma uygulamasıdır. Electron kullanılarak geliştirilmiştir. Kullanıcı dostu arayüzü ve güçlü özellikleriyle hızlı ve etkili bir not deneyimi sunar.

---

## 🚀 Özellikler

- 🧠 **Yerel veri saklama (LocalStorage)**
- 🌗 **Karanlık / Aydınlık tema desteği**
- 🔍 **Anlık arama ve filtreleme**
- 💾 **Otomatik ve manuel kaydetme**
- 🧹 **Boş notları uyarı ile engelleme**
- 📅 **Oluşturulma / düzenlenme tarihi**
- 🧮 **Kelime ve karakter sayacı**
- ⌨️ **Klavye kısayolları desteği**
- 🔔 **Dinamik bildirim sistemi**
- 🗑️ **Silme onay modali**



## 📁 Proje Yapısı

notera/
├── index.html # Uygulama arayüzü
├── app.js # Uygulama mantığı ve işlevler
├── style.css # Tema ve görünüm
├── main.js # Electron giriş dosyası
├── package.json # Bağımlılıklar ve scriptler
└── assets/ # (Varsa) ikon, font, görseller


---

## ⚙️ Kurulum ve Çalıştırma

### 1. Gereksinimler

- [Node.js](https://nodejs.org/) (v16 veya üzeri)
- `npm` (Node.js ile birlikte gelir)

### 2. Projeyi Başlat

```bash
# Projeyi klonla
git clone https://github.com/kullaniciadi/notera.git
cd notera

# Gerekli paketleri yükle
npm install

# Uygulamayı başlat
npm start

```

Derleme (Opsiyonel)
```
npm install -g electron-packager

# Windows için derleme
electron-packager . Notera --platform=win32 --arch=x64 --overwrite
```
Klavye Kısayolları

| Kısayol    | İşlev                  |
| ---------- | ---------------------- |
| `Ctrl + N` | Yeni not oluştur       |
| `Ctrl + S` | Notu kaydet            |
| `Ctrl + F` | Arama kutusuna odaklan |
| `Ctrl + T` | Temayı değiştir        |
| `Delete`   | Seçili notu sil        |




 Geliştirici Notları
Tüm veriler localStorage içinde notera-notes key’i ile saklanır.

Tema tercihi notera-theme olarak kayıt altına alınır.

Kodlar modüler ve açıklamalıdır.

app.js dosyasında tüm işlevler DOMContentLoaded ile başlatılır.

Bu proje MIT lisansı ile lisanslanmıştır. Detaylar için LICENSE dosyasına göz atabilirsiniz.
