var form = document.getElementById("contact-embed");
if (form !== null) {
    form.addEventListener("submit", formSubmit);
}

function formSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    grecaptcha.ready(function() {
        // do request for recaptcha token
        // response is promise with passed token
        grecaptcha.execute('6LdG0n0hAAAAAGI740Voq8YqSp0LEDzNepZIHoSd', {action: 'contact'}).then(function(token) {
            // add token to form
            formData.append('g-recaptcha-response', token);
            fetch("https://api.formcake.com/api/form/8c2ae0c4-68a5-4d29-9512-30639cc74255/submission",
                  {
                      method: "POST",
                      body: formData,
                      mode: 'no-cors'
                  })
                .then( response => {
                    function redirect() {
                        window.location.href = "/page/contacted/";
                    }
                    redirect();
                })
                .catch(error => console.log(error));
        });
    });
};
