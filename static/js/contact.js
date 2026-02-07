const form = document.getElementById("contact-embed");
if (form !== null) {
  form.addEventListener("submit", formSubmit);
}

function formSubmit(e) {
  e.preventDefault();
  const formData = new FormData(form);

  // Submit to Netlify Forms
  fetch("/", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(formData).toString(),
  })
    .then((response) => {
      if (response.ok) {
        window.location.href = "/page/contacted/";
      } else {
        throw new Error("Form submission failed");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("There was an error submitting the form. Please try again.");
    });
}
