function checkAge(dateInput) {
  const today = new Date();
  const minDate = new Date(
    today.getFullYear() - 65,
    today.getMonth(),
    today.getDate()
  );
  const maxDate = new Date(
    today.getFullYear() - 18,
    today.getMonth(),
    today.getDate()
  );

  const toISO = (date) => date.toISOString().split("T")[0];

  dateInput.min = toISO(minDate);
  dateInput.max = toISO(maxDate);
}
