import {
    Suspense,
  } from "solid-js"
  
  export function Map() {
    return (
      <>
        <div class="w-full h-195">
            <div class="h-[100%] overflow-hidden">
                <Suspense fallback={<div class="animate-pulse bg-gray-200 w-full h-full" />}>
                    <iframe
                        src="https://homebase-map-nextjs.vercel.app"
                        style="width: 100%; height: 94%; margin: 0; padding: 0; border: none; overflow: hidden; user-select: none; border-radius: 17px; border: 3px dashed rgba(23, 96, 255, 0.24);"
                        allow="geolocation"
                        // @ts-ignore
                        scrolling="no"
                    />
                </Suspense>
            </div>
        </div>
      </>
    )
  }
