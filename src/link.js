import { createElement, forwardRef } from 'react';
import './link.css';

/**
 * Instruct the browser to navigate to the specified URL.
 */
export function navigate(url)
{
    try {
        window.history.pushState({}, '', url);
        const navigationEvent = new Event('pushstate');
        window.dispatchEvent(navigationEvent);
    } catch {
        document.location.assign(url); // cross-origin?
    }
}

/**
 * Create a Link component.
 *
 * Class styles: `disabled`, `bold`, `style-1`, `style-2` and `style-3`.
 */
export const Link = forwardRef((props, ref) => {
    props = { ...props };

    props.className = `link ${props.className??''} ${props.cls??''}`;

    const onClick = props.onClick;
    props.onClick = (event) => {
        if (onClick?.(event)) return;

        const href = event.target.getAttribute('href');
        if (href === '#') return event.preventDefault();
        if (href.startsWith('#')) return;
        const target = event.target.getAttribute('target');

        const isLeftClick = event.button === 0;
        const isCurrentCtx = !target || target === '_self';
        const isModifiedEvent = event.metaKey || event.altKey || event.ctrlKey || event.shiftKey;

        if (isLeftClick && isCurrentCtx && !isModifiedEvent) {
            navigate(href);
            event.preventDefault();
        }
    };

    return createElement('a', { ref, ...props });
});
