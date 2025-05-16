const form = document.getElementById('habit-form');
const input = document.getElementById('habit-input');
const container = document.getElementById('habits-container');

let habits = JSON.parse(localStorage.getItem('habits')) || [];

function saveHabits() {
  localStorage.setItem('habits', JSON.stringify(habits));
}

function generateDays() {
  const today = new Date();
  const days = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().split('T')[0]);
  }
  return days;
}

function calculateStreak(dates) {
  const today = new Date().toISOString().split('T')[0];
  let streak = 0;
  for (let i = 0; i < 30; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    if (dates.includes(dateStr)) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

function renderHabits() {
  container.innerHTML = '';
  const days = generateDays();

  habits.forEach((habit, habitIndex) => {
    const habitDiv = document.createElement('div');
    habitDiv.className = 'habit';

    const title = document.createElement('div');
    title.className = 'habit-title';
    title.textContent = habit.name;

    const streakText = document.createElement('div');
    streakText.className = 'streak';
    streakText.textContent = `Current Streak: ${calculateStreak(habit.checkedDates)} days`;

    const calendar = document.createElement('div');
    calendar.className = 'calendar';

    days.forEach(date => {
      const dayDiv = document.createElement('div');
      dayDiv.className = 'day';
      if (habit.checkedDates.includes(date)) {
        dayDiv.classList.add('checked');
      }
      dayDiv.title = date;
      dayDiv.addEventListener('click', () => {
        const index = habit.checkedDates.indexOf(date);
        if (index > -1) {
          habit.checkedDates.splice(index, 1);
        } else {
          habit.checkedDates.push(date);
        }
        saveHabits();
        renderHabits();
      });
      calendar.appendChild(dayDiv);
    });

    habitDiv.appendChild(title);
    habitDiv.appendChild(calendar);
    habitDiv.appendChild(streakText);
    container.appendChild(habitDiv);
  });
}

form.addEventListener('submit', e => {
  e.preventDefault();
  const name = input.value.trim();
  if (!name) return;
  habits.push({ name, checkedDates: [] });
  saveHabits();
  renderHabits();
  input.value = '';
});

renderHabits();

