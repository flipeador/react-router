/**
 * Create a Route component.
 * @param {String} path
 * Path pattern to match against the current page URL.
 * - If the path equals `/`, then the root url matches.
 * - If the path equals `*`, then any url matches.
 * - If a segment starts with `:`, then it becomes a dynamic segment.
 * - If a segment ends with `?`, then it becomes optional.
 * - If a segment contains `*`, then the start and end is checked.
 * @param {String} title
 * The title of the page.
 * @param {String} element
 * Element or component function to render when the path matches the page URL.
 */
// eslint-disable-next-line no-unused-vars
export function Route({ path, title, element }) {
    return null;
}
