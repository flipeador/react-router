function tryDecodeURIComponent(value)
{
    if (!value) return value;
    try {
        return decodeURIComponent(value);
    } catch {
        return value;
    }
}

function checkWildcard(x, y)
{
    const pos = y.indexOf('*');
    return pos === -1 ? x === y : (
        x.startsWith(y.slice(0, pos))
     && x.endsWith(y.slice(pos + 1))
    );
}

function splitUrlPath(path)
{
    return path
    .replace(/^\/+|\/+$/ug, '')
    .split('/');
}

export function parseUrlPath(currentPath, targetPath)
{
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

    for (let i = 0; i < targetPath.length; ++i)
    {
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

export function getCurrentPath()
{
    return window.location.pathname;
}
