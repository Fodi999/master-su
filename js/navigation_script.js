document.addEventListener('DOMContentLoaded', () => {
    const mainContent = document.getElementById('main-content');
  
    // При первой загрузке страницы загружаем /home в main#main-content
    fetch('/home')
      .then(response => response.text())
      .then(html => {
        mainContent.innerHTML = html;  // Загружаем content в контейнер
      })
      .catch(error => console.error('Error loading home content:', error));
  
    // Слушаем клики по ссылкам и загружаем соответствующий контент
    const links = document.querySelectorAll('.nav-link');
  
    links.forEach(link => {
      link.addEventListener('click', (event) => {
        event.preventDefault();  // Предотвращаем стандартное поведение ссылки
        const page = link.getAttribute('data-page');  // Получаем путь страницы
  
        // Делаем fetch-запрос, чтобы получить HTML-контент только для основного содержимого
        fetch(page)
          .then(response => {
            if (!response.ok) throw new Error('Failed to load page');
            return response.text();  // Получаем текст HTML
          })
          .then(html => {
            // Извлекаем только нужный контент из ответа и вставляем в main-content
            mainContent.innerHTML = html;  // Заменяем только содержимое внутри main-content
  
            // Обновляем адрес в браузере без перезагрузки страницы
            history.pushState(null, '', page);
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
          // Обновляем только содержимое main-content
          mainContent.innerHTML = html;
        })
        .catch(error => console.error('Error loading page:', error));
    });
  });
  
  
  
  
  
  
  
  