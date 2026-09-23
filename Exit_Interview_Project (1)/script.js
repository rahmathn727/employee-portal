document.addEventListener("DOMContentLoaded", function () {
  const todayDate = document.getElementById("todayDate");

  if (todayDate) {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    todayDate.value = `${yyyy}-${mm}-${dd}`;
  }

  const form = document.getElementById("exitForm");

  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();

      alert("Exit Interview Form submitted successfully!");

      form.reset();

      if (todayDate) {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, "0");
        const dd = String(today.getDate()).padStart(2, "0");
        todayDate.value = `${yyyy}-${mm}-${dd}`;
      }
    });
  }
});
