import { Suspense } from "react";
import "@plusguard/skeleton/index.css";

/*
 * With Next, the "when" is Next's: a loading.tsx beside a page, or a
 * <Suspense> around a part of it, shows its fallback while the server
 * waits for data, and swaps the real content in when it arrives. The
 * skeleton package only draws the stand-in. No client code anywhere.
 *
 *   app/videos/loading.tsx    export default function Loading() {
 *                                 return <VideoGridSkeleton />;
 *                             }
 *   app/videos/page.tsx       export default async function Page() {
 *                                 const videos = await getVideos();
 *                                 return <VideoGrid videos={videos} />;
 *                             }
 */

const title = "text-sm leading-snug";
const channel = "text-xs";

/* The stand-in: the card's own layout, every part a skeleton. */
export function VideoGridSkeleton() {
    return (
        <div aria-busy="true" aria-label="Loading videos" className="grid gap-x-4 gap-y-8 sm:grid-cols-3">
            {Array.from({ length: 6 }, (_, i) => (
                <div key={i} className="flex flex-col gap-3">
                    <div data-pg-skeleton className="aspect-video" />
                    <div className="flex gap-3">
                        <div data-pg-skeleton="circle" className="w-9" />
                        {/* The same classes as the real title and channel: the
                            same font and line-height, so the same height. */}
                        <div className="flex flex-1 flex-col gap-1">
                            <div data-pg-skeleton="text" className={`${title} [--pg-skeleton-lines:2]`} />
                            <div data-pg-skeleton="text" className={`${channel} [--pg-skeleton-last:40%]`} />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

type Video = { id: string; title: string; channel: string; cover: string };

async function getVideos(): Promise<Video[]> {
    const res = await fetch("https://example.com/api/videos");
    return res.json();
}

/* The real grid. The covers use the image package: once the data is here,
   its grey — the same grey — stands in until each file has loaded. */
async function VideoGrid() {
    const videos = await getVideos();
    return (
        <div className="grid gap-x-4 gap-y-8 sm:grid-cols-3">
            {videos.map((v) => (
                <article key={v.id} className="flex flex-col gap-3">
                    <div data-pg-image-frame className="aspect-video overflow-hidden rounded-lg">
                        <img data-pg-image src={v.cover} alt="" className="h-full w-full object-cover" />
                    </div>
                    <div className="flex gap-3">
                        <span className="grid size-9 flex-none place-items-center rounded-full bg-neutral-100 text-sm">
                            {v.channel[0]}
                        </span>
                        <div className="flex flex-1 flex-col gap-1">
                            {/* Two lines, always: a one-line title keeps the room
                                its skeleton took. */}
                            <h3 className={`${title} line-clamp-2 min-h-[2lh] font-semibold`}>{v.title}</h3>
                            <p className={`${channel} text-neutral-500`}>{v.channel}</p>
                        </div>
                    </div>
                </article>
            ))}
        </div>
    );
}

/* One part of a page, not the whole route: <Suspense> does the same. */
export function Example() {
    return (
        <Suspense fallback={<VideoGridSkeleton />}>
            <VideoGrid />
        </Suspense>
    );
}
