import {
    Children,
    createElement,
    isValidElement,
    useState,
    useEffect,
    useTransition
} from 'react';

import {
    navigate,
    parseUrlPath,
    setPageTitle
} from './utils.js';

const cache = {
    props: {
        isPending: false, // whether there is a pending transition
        routeParams: { }  // dynamic params
    },
    event: { },
    pages: { }
};

function getUrl(url=document.location) {
    return url.origin + url.pathname + url.search;
}

function updateCache(event) {
    const url = getUrl(cache.url);
    cache.pages[url] ??= {};
    cache.pages[url].scrollX = window.scrollX;
    cache.pages[url].scrollY = window.scrollY;
    cache.url = new URL(document.location);
    cache.event = event ?? { };
    return url === getUrl();
}

/**
 * Get cached properties of the current page.
 */
export function useRouteProps() {
    return cache.props;
}

/**
 * Create a Router component.
 * @param {String?} name Application name.
 * @param {Array?} routes List of routes (`{path,element}`).
 * @param fallback Fallback page (element or function component).
 */
export function Router({ name, routes, fallback, children }) {
    const [currentPath, setCurrentPath] = useState(window.location.pathname);
    const [isPending, startTransition] = useTransition();

    const currentUrl = getUrl();
    cache.props = { isPending };

    useEffect(() => {
        if (!isPending && cache.event.type === 'pushstate') {
            const page = cache.pages[currentUrl];
            window.scroll(page?.scrollX, page?.scrollY);
        }
    }, [isPending, currentUrl]);

    useEffect(() => {
        const onLocationChange = event => {
            if (updateCache(event)) return;
            startTransition(() => {
                setCurrentPath(window.location.pathname);
            });
        };

        window.addEventListener('pushstate', onLocationChange);
        window.addEventListener('popstate', onLocationChange);

        updateCache();
        navigate(document.location.hash);

        return () => {
            window.removeEventListener('pushstate', onLocationChange);
            window.removeEventListener('popstate', onLocationChange);
        };
    }, []);

    routes = Children.map(children, child => {
        return child.props.path && child.props;
    }).concat(routes ?? []).filter(Boolean);

    const route = routes.find(({ path }) => {
        cache.props.routeParams = parseUrlPath(currentPath, path);
        return Boolean(cache.props.routeParams);
    });

    const element = route?.element ?? fallback;

    setPageTitle(route?.title, name);

    return isValidElement(element)
        ? element
        : createElement(element, cache.props);
}
