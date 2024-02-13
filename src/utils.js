/**
 * Instruct the browser to navigate to the specified URL.
 * @example
 * // Navigate to the home page.
 * navigate('/home');
 * // Navigate to the specified URL.
 * navigate('https://google.com');
 * // Sections of a page with document fragments.
 * // Show the element whose ID is 'my-heading'.
 * navigate('#my-heading');
 * // Specific text portions with text fragments.
 * // Show and highlight the text 'My Heading'.
 * navigate('#:~:text=My Heading');
 */
export function navigate(url) {
    url = `${url}`;
    if (!url) return;

    if (url.startsWith('#')) {
        // Jump to a document/text fragment in the current page.
        document.location.hash = '';
        document.location.hash = url;
        return;
    }

    try {
        // Navigate to a page without reloading the whole document.
        window.history.pushState({}, '', url);
        window.dispatchEvent(new Event('pushstate'));
    } catch {
        // Navigate to a URL with different origin.
        document.location.assign(url); // cross-origin?
    }
}

/**
 * Set the title of the current page.
 */
export function setPageTitle(title, name, sep='-') {
    title = title ? `${title}`.trim() : '';
    name = name ? `${name}`.trim() : '';
    return document.title = (
        title ? name
        ? `${title}${sep.length > 1 ? sep : ` ${sep} `}${name}`
        : title : name
    );
}

function tryDecodeURIComponent(value) {
    if (!value) return value;
    try {
        return decodeURIComponent(value);
    } catch {
        return value;
    }
}

function checkWildcard(x, y) {
    const pos = y.indexOf('*');
    return pos === -1 ? x === y : (
        x.startsWith(y.slice(0, pos)) &&
        x.endsWith(y.slice(pos + 1))
    );
}

function splitUrlPath(path) {
    return path
    .replace(/^\/+|\/+$/ug, '')
    .split('/');
}

export function parseUrlPath(currentPath, targetPath) {
    currentPath = splitUrlPath(currentPath);
    targetPath = splitUrlPath(targetPath);

    if (targetPath.length === 1 && targetPath[0] === '*'
    || (targetPath.length === 1 && currentPath.length === 1
        && !targetPath[0] && !currentPath[0]))
        return {};

    if (targetPath.length < currentPath.length)
        return;

    let minus = 0;
    const params = {};

    for (let i = 0; i < targetPath.length; ++i) {
        let cpath = tryDecodeURIComponent(currentPath[i - minus]);
        let tpath = targetPath[i];

        const optional = tpath.endsWith('?');
        if (optional)
            tpath = tpath.replace(/\?+$/ug, '');

        if (!cpath) {
            if (optional) continue;
            return null;
        }

        if (tpath.startsWith(':')) {
            params[tpath.slice(1)] = cpath;
            continue;
        }

        cpath = cpath.toLowerCase();
        tpath = tpath.toLowerCase();

        if (!optional) {
            if (!checkWildcard(cpath, tpath))
                return null;
        } else if (cpath !== tpath)
            ++minus;
    }

    return params;
}
