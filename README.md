# Color Mixer 🎨

[![Run Tests](https://github.com/NazarHavryliuk/color-mixer/actions/workflows/mine.yml/badge.svg?branch=main)](https://github.com/NazarHavryliuk/color-mixer/actions/workflows/mine.yml)  
[![Vercel Deployment](https://vercel.com/button)](https://color-mixer-edeiqgw7e-nazars-projects-c6ebf03f.vercel.app/)

## 📌 Project Description (MVP)

Color Mixer is a web application that allows users to mix RGB colors
using three sliders (Red, Green, Blue). The resulting color is displayed
in real time in a preview box. You can also read the "sensor" color
by clicking the **Read Sensors** button, which updates a separate display.

This project demonstrates:

- HTML, CSS, JavaScript (Vanilla JS)
- DOM manipulation and event handling
- CI with GitHub Actions (unit and e2e tests)
- Deployment to Vercel

---

## 🌐 Live Deployment

You can try the app online here:  
[https://color-mixer.vercel.app](https://color-mixer-edeiqgw7e-nazars-projects-c6ebf03f.vercel.app/)

---

## 🚀 How to Run Locally

1. Clone the repository:

   ```bash
   git clone https://github.com/NazarHavryliuk/color-mixer.git
Enter the project directory:

cd color-mixer
Install dependencies:

npm ci
Start local server (for e2e tests or preview):

npx serve ./ -l 3000
Open src/index.html in your browser (or visit http://localhost:3000).

🧪 Testing
Unit Tests (Vitest):

npm run test:unit
npm run test:unit:ui
npm run test:unit:coverage
End-to-End Tests (Playwright):

npm run test:e2e
npm run test:e2e:ui
Run all tests:

npm run test
🛠 Technologies Used
HTML5, CSS3, JavaScript (Vanilla)

Node.js & npm

Vite (build tool)

Vitest (unit testing)

Playwright (end-to-end testing)

GitHub Actions (CI)

Vercel (deployment)

📂 Project Structure

color-mixer/

│

├─ node_modules/          # встановлені пакети (не комітяться)

├─ dist/                  # збірка для продакшену

├─ public/                # статичні файли (favicon, картинки)

│

├─ __tests__/             # тести

│  ├─ unit/               # юніт-тести (Vitest)

│  │   ├─ color.test.js

│  │   └─ script.test.js

│  └─ e2e/                # інтеграційні / e2e тести (Playwright)

│      └─ e2e.spec.js

│

├─ src/                   # основний код проекту

│  ├─ css/

│  │   └─ style.css

│  ├─ js/

│  │   ├─ color.js

│  │   └─ script.js

│  └─ index.html          # головна HTML-сторінка

│

├─ package.json            # залежності, скрипти, конфігурації

├─ vite.config.js          # конфіг для Vite

├─ vitest.config.js        # конфіг для Vitest

├─ playwright.config.js    # конфіг для Playwright

└─ .gitignore
⚙️ CI/CD
GitHub Actions: автоматичне тестування на кожен push або pull request (main, develop, feature/*)

Vercel: автоматичний деплой на production після merge в main

Для деплоя використовується секретний токен Vercel (VERCEL_TOKEN) через GitHub Secrets.
Всі логи тестів приховують конфіденційні дані.

💡 Author
Nazar Havryliuk
GitHub Repository