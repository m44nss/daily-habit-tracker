const KEY = "daily-habit-tracker-v1";
const form = document.querySelector("#form");
const input = document.querySelector("#habit");
const list = document.querySelector("#list");
const empty = document.querySelector("#empty");
const message = document.querySelector("#message");
const doneCount = document.querySelector("#done");
const totalCount = document.querySelector("#total");
const fill = document.querySelector("#fill");
const caption = document.querySelector("#caption");

function loadHabits() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) || "[]");
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}
let habits = loadHabits();

function saveHabits() {
  localStorage.setItem(KEY, JSON.stringify(habits));
}

function render() {
  list.replaceChildren();
  empty.hidden = habits.length > 0;

  habits.forEach((habit) => {
    const item = document.createElement("li");
    item.className = habit.done ? "done" : "";

    const check = document.createElement("button");
    check.className = "check";
    check.type = "button";
    check.textContent = habit.done ? "✓" : "";
    check.setAttribute("aria-label", `${habit.done ? "Mark incomplete" : "Mark complete"}: ${habit.name}`);
    check.setAttribute("aria-pressed", String(habit.done));
    check.addEventListener("click", () => {
      habit.done = !habit.done;
      saveHabits();
      render();
    });

    const name = document.createElement("span");
    name.className = "name";
    name.textContent = habit.name;

    const remove = document.createElement("button");
    remove.className = "delete";
    remove.type = "button";
    remove.textContent = "Delete";
    remove.setAttribute("aria-label", `Delete habit: ${habit.name}`);
    remove.addEventListener("click", () => {
      habits = habits.filter((entry) => entry.id !== habit.id);
      saveHabits();
      render();
      message.textContent = "Habit deleted.";
    });

    item.append(check, name, remove);
    list.append(item);
  });

  const total = habits.length;
  const done = habits.filter((habit) => habit.done).length;
  const percent = total ? Math.round((done / total) * 100) : 0;
  doneCount.textContent = done;
  totalCount.textContent = total;
  fill.style.width = `${percent}%`;
  caption.textContent = total === 0 ? "Add a habit to get started." :
    done === total ? "Amazing! Every habit is complete." : `${percent}% complete — keep going!`;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = input.value.trim();
  if (!name) {
    message.textContent = "Please enter a habit name.";
    input.focus();
    return;
  }
  habits.unshift({ id: `${Date.now()}-${Math.random().toString(16).slice(2)}`, name, done: false });
  saveHabits();
  render();
  input.value = "";
  message.textContent = "Habit added. Small steps count!";
  input.focus();
});

render();
