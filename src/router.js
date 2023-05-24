import {
    Children, createElement, isValidElement,
    useState, useEffect, useTransition
} from 'react';
import { getCurrentPath, parseUrlPath } from './utils.js';

const cache = {
    props: {
        isPending: false, // whether there is a pending transition
        routeParams: {} // dynamic params
    },
    event: {}
};

/**
 * Get cached properties of current page.
 */
export function useRouteProps()
{
    return cache.props;
}

/**
 * Create a Router component.
 * @param {Array?} routes List of routes (`{path,element}`).
 * @param fallback Fallback page (element or function component).
 */
export function Router({ routes, fallback, children })
{
    const [currentPath, setCurrentPath] = useState(getCurrentPath());
    const [isPending, startTransition] = useTransition();

    cache.props = { isPending };

    if (!isPending && cache.event.type === 'pushstate')
        window.scroll(0, 0);

    useEffect(() => {
        const onLocationChange = (event) => {
            cache.event = event;
            startTransition(() => {
                setCurrentPath(getCurrentPath());
            });
        };

        window.addEventListener('pushstate', onLocationChange);
        window.addEventListener('popstate', onLocationChange);

        return () => {
            window.removeEventListener('pushstate', onLocationChange);
            window.removeEventListener('popstate', onLocationChange);
        };
    }, []);

    const childrenRoutes = Children.map(children, child => {
        return child.type.name === 'Route' && child.props;
    });

    routes = (routes??[]).concat(childrenRoutes).filter(Boolean);

    const route = routes.find(({ path }) => {
        cache.props.routeParams = parseUrlPath(currentPath, path);
        return Boolean(cache.props.routeParams);
    });

    const element = route?.element ?? fallback;

    return isValidElement(element)
        ? element
        : createElement(element, cache.props);
}
