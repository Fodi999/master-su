const express = require('express');
const path = require('path');
const fs = require('fs');
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
app.use('/models', express.static(path.join(__dirname, '../models')));
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

// Путь к JSON-файлу
const dataFilePath = path.join(__dirname, './models/data.json');

// Чтение данных из JSON-файла
app.get('/data', (req, res) => {
  fs.readFile(dataFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Ошибка чтения файла:', err);
      return res.status(500).send('Ошибка чтения файла');
    }
    res.send(JSON.parse(data));
  });
});

// Запись данных в JSON-файл
app.post('/data', (req, res) => {
  const newData = req.body;
  fs.writeFile(dataFilePath, JSON.stringify(newData, null, 2), 'utf8', (err) => {
    if (err) {
      console.error('Ошибка записи файла:', err);
      return res.status(500).send('Ошибка записи файла');
    }
    res.send('Данные успешно сохранены');
  });
});

// Обработка вопросов от пользователя
app.post('/ask-bot', (req, res) => {
  const { question } = req.body;

  fs.readFile(dataFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Ошибка чтения файла:', err);
      return res.status(500).send('Ошибка чтения файла');
    }

    const qaData = JSON.parse(data);
    const found = qaData.find(item => item.question.toLowerCase().includes(question.toLowerCase()));

    if (found) {
      res.json({ answer: found.answer });
    } else {
      res.json({ answer: 'Извините, я пока не знаю ответа на этот вопрос.' });
    }
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
