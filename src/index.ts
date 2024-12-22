import express, { Request, Response } from 'express';
import path from 'path';

const app = express();
const PORT = 3000;

// Установка EJS как шаблонизатора
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

// Middleware
app.use(express.json());

// Настройка статической папки
app.use(express.static(path.join(__dirname, '../public')));

// Маршрут для главной страницы
app.get('/', (req: Request, res: Response) => {
  res.render('index', {
    title: 'Master Sushi',
    message: 'Welcome to Master Sushi!',
    logo: '/images/Group 5.svg', // Путь к логотипу
    technologies: [
      'TypeScript for safer JavaScript',
      'Express for fast and flexible back-end',
      'Node.js for scalable server-side applications',
      'EJS for dynamic templates',
      'Tailwind CSS for modern styling',
    ],
    images: ['/images/sushi1.jpg', '/images/sushi2.jpg'], // Примеры изображений
  });
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});


