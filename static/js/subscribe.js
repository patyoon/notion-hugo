var form = document.getElementById("subscribe-form");
if (form !== null) {
    form.addEventListener("submit", formSubmit);
}

function formSubmit(e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append(
        'email',
        document.querySelector('input[name="email"]').value
    );
    grecaptcha.ready(function() {
        // do request for recaptcha token
        // response is promise with passed token
        grecaptcha.execute('6LdG0n0hAAAAAGI740Voq8YqSp0LEDzNepZIHoSd', {action: 'contact'}).then(function(token) {
            // add token to form
            formData.append('g-recaptcha-response', token);
            fetch("https://getform.io/f/51c5ce85-9f44-49af-805c-c98ebb34fe4f",
                  {
                      method: "POST",
                      body: formData,
                  })
                .then( response => {
                    function redirect() {
                        window.location.href = "/page/subscribed/";
                    }
                    if (response['ok']) {
                        console.log(response);
                        redirect();
                    }
                })
                .catch(error => console.log(error));
        });
    });
};
