import './link.css';

import {
    forwardRef,
    useCallback,
    createElement
} from 'react';

import { navigate } from './utils.js';

/**
 * Create a Link component. \
 * Class styles: `disabled`, `bold`, `style-1`, `style-2` and `style-3`.
 */
export const Link = forwardRef((props, ref) => {
    const { onClick } = props;

    let className = 'link';
    if (props.className)
        className += ` ${props.className}`;

    const _onClick = useCallback(event => {
        if (onClick?.(event)) return;

        // Get the URL that the hyperlink points to.
        const href = event.currentTarget.getAttribute('href') ?? '/';

        // If href is '#', prevent browser defaults and do nothing.
        if (href === '#') return event.preventDefault();
        // If href is not a route, do browser defaults.
        // href can be a document/text fragment, or a protocol.
        if (!href.startsWith('/')) return;

        // Get the browsing context of the hyperlink.
        // _self   — The current browsing context (default).
        // _blank  — A new tab, but users can configure browsers to open a new window instead.
        // _parent — The parent browsing context of the current one. If no parent, behaves as _self.
        // _top    — The topmost browsing context. If no ancestors, behaves as _self.
        const target = event.currentTarget.getAttribute('target') ?? '_self';

        const isCurrentCtx = target === '_self'; // current browsing context
        const isMainButton = event.button === 0; // usually the left button
        const isModifiedEvent = event.metaKey || event.altKey || event.ctrlKey || event.shiftKey;

        if (isCurrentCtx && isMainButton && !isModifiedEvent) {
            navigate(href);
            event.preventDefault();
        }
    }, [onClick]);

    return createElement('a', {
        ref, ...props,
        // overrides
        className,
        onClick: _onClick
    });
});

Link.displayName = 'Link';
