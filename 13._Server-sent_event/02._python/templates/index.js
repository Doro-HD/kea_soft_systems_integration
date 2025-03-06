const divDate = document.getElementById('date');

const eventSource = new EventSource('/sse');
eventSource.onmessage = (event) => setDate(event.data);

function setDate(date) {
	divDate.textContent = date;
}
