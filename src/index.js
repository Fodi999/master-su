const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Установка EJS как шаблонизатора
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

// Middleware для парсинга JSON
app.use(express.json());

// Настройка статической папки для CSS, изображений, JS и других статичных файлов
app.use('/css', express.static(path.join(__dirname, '../css')));
app.use('/images', express.static(path.join(__dirname, '../images')));
app.use('/js', express.static(path.join(__dirname, '../js')));
app.use(express.static(path.join(__dirname, '../public')));

// Основной маршрут (рендерит оболочку с хедером и меню)
app.get('/', (req, res) => {
  res.render('index', {
    title: 'Master Sushi',
  });
});

// Маршрут для страницы Home (загружается в main#main-content)
app.get('/home', (req, res) => {
  res.render('home', {
    title: 'Master Sushi',
  });
});

// Маршрут для страницы Ask
app.get('/ask', (req, res) => {
  res.render('ask', {
    title: 'Ask Page',
  });
});

// Маршрут для страницы About
app.get('/about', (req, res) => {
  res.render('about', {
    title: 'About Us',
  });
});


// Маршрут для страницы Contact
app.get('/contact', (req, res) => {
  res.render('contact', {
    title: 'Contact Page',
  });
});

// Маршрут для страницы Recipes
app.get('/recipes', (req, res) => {
  res.render('recipes', {
    title: 'Recipes Page',
  });
});

// Обработка ошибок
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Что-то пошло не так!');
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});












