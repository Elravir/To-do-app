# To-do-app

Интерактивное веб-приложение для создания и управления задачами.  
Frontend реализован на HTML + JavaScript с библиотеками **moment.js** и **FullCalendar**, а backend — на **Python Flask**.  
Хранение данных осуществляется через MySQL (не включён в репозиторий).

---

## Возможности

- Создание задач с датами и временем
- Привязка задач к комнатам (или встречам)
- Отображение задач в календарном виде (через FullCalendar)
- Хранение состояния через backend Flask

---

## Установка и запуск

### 1. Клонировать репозиторий
```bash
git clone https://github.com/Elravir/To-do-app.git
cd To-do-app
```

### 2. Установить зависимости
```bash
pip install -r requirements.txt
```
### 3. Запустить backend
```bash
python app.py
```
### 4. Перейти на сайт
http://localhost:5000

