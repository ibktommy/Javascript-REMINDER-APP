// INPUT CLASS
class Reminder {
	constructor(title, description) {
		this.title = title;
		this.description = description;
	}
}

// UI CLASS
class UI {
	addReminderToList(reminder) {
		const table = document.querySelector(".table");
		const tableList = document.createElement("ul");
		tableList.setAttribute("class", "table-list");
		tableList.innerHTML = `
      <li>${reminder.title}</li>
      <li>${reminder.description}</li>
      <li class="icon-list">
         <i class="fa fa-check"></i>
      </li>
     `;

		table.appendChild(tableList);
	}

	clearFields() {
		document.querySelector("#title").value = "";
		document.querySelector("#description").value = "";
	}
}

// LOCAL STORAGE CLASS
class LocalStorage {
	static getDataFromLS() {
		let reminderList;
		if (localStorage.getItem("reminderList") === null) {
			reminderList = [];
		} else {
			reminderList = JSON.parse(localStorage.getItem("reminderList"));
		}

		return reminderList;
	}

	static addReminderListToLS(reminder) {
		const reminders = LocalStorage.getDataFromLS();

		reminders.push(reminder);
		localStorage.setItem("reminderList", JSON.stringify(reminders));
	}

	static addRemindersFromLS() {
		const addReminders = LocalStorage.getDataFromLS();
		addReminders.forEach((addReminder) => {
			const ui = new UI();
			ui.addReminderToList(addReminder);
		});
	}

	static deleteReminderFromLS(title) {
		const reminders = LocalStorage.getDataFromLS();

		reminders.forEach((reminder, index) => {
			if (reminder.title === title) {
				reminders.splice(index, 1);
			}
		});

		localStorage.setItem("reminderList", JSON.stringify(reminders));
	}
}

// FORM EVENT LISTENER
const form = document.getElementById("mainForm");

form.addEventListener("submit", function (e) {
	e.preventDefault();

	let [title, description] = [
		document.querySelector("#title").value,
		document.querySelector("#description").value,
	];

	// Instantiate Reminder Class
	const reminder = new Reminder(title, description);

	// Instantiate UI Class
	const ui = new UI();

	ui.addReminderToList(reminder);
	ui.clearFields();
	LocalStorage.addReminderListToLS(reminder);
});

// STATUS EVENT LISTENER
const table = document.querySelector(".table");
table.addEventListener("click", function (e) {
	const target = e.target;
	const title =
		target.parentElement.previousElementSibling.previousElementSibling
			.textContent;
	if (target.className === "fa fa-check") {
		target.parentElement.style.backgroundColor = "#3b3939";
		setTimeout(() => {
			const targetBody = target.parentElement.parentElement;
			targetBody.remove();
		}, 700);
	}
	LocalStorage.deleteReminderFromLS(title);
});

// REFRESH PAGE EVENT
document.addEventListener("DOMContentLoaded", LocalStorage.addRemindersFromLS);
