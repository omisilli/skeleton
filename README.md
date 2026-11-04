# skeleton

Grey boxes, circles and lines that stand in for content that has not
arrived yet — the way YouTube draws its page before the videos load. One
stylesheet, no JavaScript, no dependencies; the same markup in a Next
`loading.tsx` and on a static page.

```html
<article aria-busy="true">
    <div data-pg-skeleton style="aspect-ratio: 16 / 9"></div>
    <div data-pg-skeleton="circle" style="width: 2.5rem"></div>
    <div data-pg-skeleton="text" style="--pg-skeleton-lines: 2"></div>
</article>
```

```sh
npm install github:omisilli/skeleton#v1.0.0
```

```ts
import "@plusguard/skeleton/index.css";
```

Or from CSS, which lets you pick the cascade layer:

```css
@import "@plusguard/skeleton/index.css" layer(components);
```

### Without a build step

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/omisilli/skeleton@v1.0.0/index.css" />
```

Pin the version (`@v1.0.0`) on a live site. A pinned URL never changes;
`@1` follows the newest 1.x release.

## skeleton or image

Two kinds of waiting, two packages. They work alone, and one after the
other they cover a card from the first moment to the last pixel.

|                  | skeleton                                          | [image](https://github.com/omisilli/image)            |
| ---------------- | ------------------------------------------------- | ----------------------------------------------------- |
| Known yet        | Nothing — which picture, which title, how many    | The picture's address; only the file is on its way    |
| Stands in for    | A whole card: cover, avatar, title lines          | One picture                                           |
| Drawn as         | Grey boxes, circles and lines, with a shimmer     | A grey ground under the `<img>`                       |
| Goes when        | Your data arrives and real markup replaces it     | The file has loaded — or failed, and the grey stays   |
| Needs JavaScript | No — Next's Suspense, or your fetch, swaps it out | Yes, a little, to tell loaded from failed             |

In order, on a page like YouTube's:

1. **skeleton** — the page is open, the list of videos is not: grey cards.
2. The list arrives; the real cards replace the skeleton.
3. **image** — each cover's file is still downloading: the same grey,
   under the picture, until it is there.

Both greys are the same half-tone by default, so step 2 is not seen. If
you change one (`--pg-skeleton-color`, `--pg-image-placeholder`), change
the other too.

Pages whose text comes in the HTML — server-rendered, static — have
nothing to wait for and need no skeleton; their images still use `image`.
A skeleton is for content fetched after the page: a list, search
results, "load more", data from an API.

## Shapes

| Attribute                  | Draws                                                              |
| -------------------------- | ------------------------------------------------------------------ |
| `data-pg-skeleton`         | A box. Give it a size: `aspect-ratio`, a `height`, or let a grid stretch it. At least `1em` tall |
| `data-pg-skeleton="circle"` | A circle, `2.5rem` wide unless you set a `width`. Stays round in a flex row |
| `data-pg-skeleton="text"`  | Lines of text, sized in `em` — set its `font-size` to the text it stands in for. The last line stops short |

```html
<!-- A heading: bigger font, one full line -->
<div data-pg-skeleton="text" class="text-3xl [--pg-skeleton-last:100%]"></div>

<!-- A pill-shaped button -->
<div data-pg-skeleton class="h-10 w-32 [--pg-skeleton-radius:999px]"></div>
```

## CSS variables

Set them anywhere above the element — on `:root` for the site, in media
queries, or with Tailwind's `[--…]`.

| Variable               | Default                   | Meaning                                                   |
| ---------------------- | ------------------------- | --------------------------------------------------------- |
| `--pg-skeleton-color`  | `rgb(127 127 127 / 0.15)` | The grey — suits light and dark themes; image's grey too  |
| `--pg-skeleton-shine`  | `rgb(127 127 127 / 0.15)` | The shimmer's band over the grey: darker on a light page, lighter on a dark one |
| `--pg-skeleton-radius` | `0.5rem`                  | Corners of a box                                          |
| `--pg-skeleton-lines`  | `1`                       | How many lines a `text` draws                             |
| `--pg-skeleton-line`   | `0.875em`                 | A line's height                                           |
| `--pg-skeleton-gap`    | `0.625em`                 | The gap between lines                                     |
| `--pg-skeleton-last`   | `60%`                     | The last line's width                                     |

Every rule is at zero weight (`:where`), so a class of yours wins — but a
`background` shorthand of yours also removes the shimmer; set
`background-color` instead.

With reduced motion asked for, there is no shimmer — the grey stays still.

## With Next

Next decides **when**: `loading.tsx` beside a page, or `<Suspense>` around
a part of it, shows the fallback the moment the page opens, streams the
real content in when the server has it, and swaps it — on page loads and
on navigation. skeleton draws **what** is shown meanwhile. No client code.

```tsx
// app/videos/loading.tsx
export default function Loading() {
    return <VideoGridSkeleton />;
}
```

```tsx
// One part of a page
<Suspense fallback={<VideoGridSkeleton />}>
    <VideoGrid />
</Suspense>
```

See [`examples/react/Example.tsx`](examples/react/Example.tsx).

## On a static page

Your fetch decides when: put the skeleton in the HTML, and replace it with
the real markup once the data is in.

```js
list.setAttribute("aria-busy", "true");
list.innerHTML = cardSkeleton.repeat(6);

const videos = await (await fetch("/api/videos")).json();
list.innerHTML = videos.map(card).join("");
list.setAttribute("aria-busy", "false");
```

See [`examples/static/index.html`](examples/static/index.html) — the cards,
every shape, and the hand-over to image.

## Screen readers

The grey shapes are empty and are not read out. Put `aria-busy="true"` on
the part that is loading — it tells screen readers that part is still
coming — and `"false"` (or remove it) when the content is in. A short `aria-label` such as "Loading
videos" says what is coming.
