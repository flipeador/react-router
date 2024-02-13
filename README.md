# React Router

Lightweight [suspense-enabled][suspense] routing library for [React][react].

- Wrap routes in a `Router` component and optionally include a fallback page.
- Assign routes to pages with the `Route` component. Wrap the pages using [lazy][lazy].
- Set the path and document title in the `Route` component for each page.
- Use the `Link` component to navigate between pages or redirect to another website.
- Use any combination of `disabled`, `bold`, `style-1`, `style-2` and `style-3` classes to style links ([demo][codepen-link]).

> [!NOTE]
> If you are developing this library and you are importing it from another project, you will probably encounter errors because the library is importing a react module wich resolves to a different export object, resulting in two copies of the react package. The react import from your application code needs to resolve to the same module as the react import from inside the package. This error can be circumvented by using [`resolve.dedupe`][dedupe] (`resolve:{dedupe:['react']}`) to force to always resolve listed dependencies to the same copy from project root.

## Installation

```bash
npm i flipeador/react-router#semver:^1.0.0
```

## Examples

<details>
<summary><h4>Example #1</h4></summary>

```js
/* eslint-disable react-refresh/only-export-components */

import React from 'react';
import ReactDOM from 'react-dom/client';
import { Router, Route, Link } from '@flipeador/react-router';

/**
 * Simulates fetching the specified text from internet.
 */
function fetchText(text, delay=2000)
{
    fetchText.cache ??= [];
    if (fetchText.cache.includes(text)) return text;
    // Throw a promise to trigger Suspense.
    throw new Promise(resolve => {
        setTimeout(() => { resolve(text); }, delay);
    }).then(text => { fetchText.cache.push(text); return text; });
}

/**
 * Home page function component.
 * @example
 * const Home = React.lazy(() => import('./pages/home.js'));
 */
function Home({ isPending })
{
    const text = fetchText('Go to /profile');
    console.log('Home:', isPending);
    return (
        <>
            <p>Welcome!</p>
            <p><Link href="/profile/123">{text}</Link></p>
            { isPending && <p>Loading profile...</p> }
        </>
    );
}

/**
 * Profile page function component.
 * @example
 * const Profile = React.lazy(() => import('./pages/profile.js'));
 */
function Profile({ isPending, routeParams })
{
    const text = fetchText('Go to /home');
    console.log('Profile:', isPending);
    return (
        <>
            <p>User ID: {routeParams.id}</p>
            <p><Link href="/">{text}</Link></p>
            { isPending && <p>Loading home...</p> }
        </>
    );
}

const root = ReactDOM.createRoot(
    document.getElementById('root')
);

root.render(
    // <React.StrictMode>
        <React.Suspense fallback={<>Loading...</>}>
            <Router fallback={<>Unknown page</>}>
                <Route path="/" element={Home}/>
                <Route path="/profile/:id" element={Profile}/>
            </Router>
        </React.Suspense>
    // </React.StrictMode>
);
```

</details>

<details>
<summary><h4>Example #2</h4></summary>

```js
/* eslint-disable react-refresh/only-export-components */

import React from 'react';
import ReactDOM from 'react-dom/client';
import { Router, Route, useRouteProps } from '@flipeador/react-router';

function Home()
{
    const { routeParams } = useRouteProps();
    return (
        <>
            <p>Welcome!</p>
            <p>/:id {routeParams.id}</p>
        </>
    );
}

const root = ReactDOM.createRoot(
    document.getElementById('root')
);

root.render(
    <React.StrictMode>
        <React.Suspense fallback={<>Loading...</>}>
            <Router fallback={<>Unknown page</>}>
                <Route path="/:id?" element={<Home/>}/>
            </Router>
        </React.Suspense>
    </React.StrictMode>
);
```

</details>

## License

This project is licensed under the **Apache License 2.0**. See the [license file](LICENSE) for details.

<!-- REFERENCE LINKS -->
[react]: https://react.dev
[react-app]: https://create-react-app.dev
[lazy]: https://react.dev/reference/react/lazy
[suspense]: https://react.dev/reference/react/Suspense

[dedupe]: https://vitejs.dev/config/shared-options#resolve-dedupe

[codepen-link]: https://codepen.io/Flipeador/pen/ExeowOy
