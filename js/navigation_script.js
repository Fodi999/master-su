document.addEventListener('DOMContentLoaded', () => {
  const mainContent = document.getElementById('main-content');

  // Функция для обновления активного элемента
  function updateActiveLink(activeLink) {
    // Убираем класс "active" со всех ссылок
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('active');
    });

    // Добавляем класс "active" к текущей ссылке
    activeLink.classList.add('active');
  }

  // При первой загрузке страницы загружаем /home
  fetch('/home')
    .then(response => response.text())
    .then(html => {
      mainContent.innerHTML = html; // Загружаем контент
      const defaultLink = document.querySelector('.nav-link[data-page="/home"]');
      updateActiveLink(defaultLink); // Устанавливаем "Home" как активную
    })
    .catch(error => console.error('Error loading home content:', error));

  // Слушаем клики по ссылкам
  const links = document.querySelectorAll('.nav-link');

  links.forEach(link => {
    link.addEventListener('click', (event) => {
      event.preventDefault(); // Предотвращаем стандартное поведение ссылки
      const page = link.getAttribute('data-page');

      if (!page) {
        console.error('Error: Missing data-page attribute');
        return;
      }

      // Делаем запрос на получение контента
      fetch(page)
        .then(response => {
          if (!response.ok) throw new Error(`Failed to load page: ${page}`);
          return response.text();
        })
        .then(html => {
          mainContent.innerHTML = html; // Обновляем содержимое
          updateActiveLink(link); // Обновляем активную ссылку
          history.pushState(null, '', page); // Обновляем URL
        })
        .catch(error => console.error('Error loading page:', error));
    });
  });

  // Обработчик для кнопки "назад" в браузере
  window.addEventListener('popstate', () => {
    const page = location.pathname;

    fetch(page)
      .then(response => response.text())
      .then(html => {
        mainContent.innerHTML = html; // Обновляем содержимое

        // Находим ссылку, соответствующую текущему пути
        const activeLink = document.querySelector(`.nav-link[data-page="${page}"]`);
        if (activeLink) {
          updateActiveLink(activeLink); // Устанавливаем её активной
        }
      })
      .catch(error => console.error('Error loading page:', error));
  });
});

  
  
  
  
  
  
  
  