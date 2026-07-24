"use client"

import { useState } from "react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@relume_io/relume-ui"

const images = [
  { id: 1, alt: "Dashboard overview", aspect: "aspect-[4/3]", span: "col-span-1" },
  { id: 2, alt: "Analytics panel", aspect: "aspect-[4/3]", span: "col-span-1" },
  { id: 3, alt: "Team workspace", aspect: "aspect-[4/3]", span: "col-span-1" },
  { id: 4, alt: "Integration hub", aspect: "aspect-[16/9]", span: "col-span-2" },
  { id: 5, alt: "Mobile app", aspect: "aspect-[3/4]", span: "col-span-1" },
  { id: 6, alt: "Workflow builder", aspect: "aspect-[4/3]", span: "col-span-1" },
  { id: 7, alt: "Settings page", aspect: "aspect-[4/3]", span: "col-span-1" },
  { id: 8, alt: "Reporting view", aspect: "aspect-[4/3]", span: "col-span-1" },
]

export function GalleryGrid() {
  const [selectedIndex, setSelectedIndex] = useState(0)

  return (
    <section className="px-6 py-16 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            See the product in action
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            Explore screenshots and design highlights from across the platform.
          </p>
        </div>

        <Dialog>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {images.map((img, i) => (
              <DialogTrigger
                key={img.id}
                asChild
                onClick={() => setSelectedIndex(i)}
              >
                <button
                  className={`${img.span} ${img.aspect} group relative w-full overflow-hidden rounded-lg border border-border bg-muted transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring`}
                >
                  <div className="flex size-full items-center justify-center">
                    <p className="text-sm text-muted-foreground">
                      {img.alt}
                    </p>
                  </div>
                  <div className="absolute inset-0 bg-foreground/0 transition-colors group-hover:bg-foreground/5" />
                </button>
              </DialogTrigger>
            ))}
          </div>

          <DialogContent
            className="max-w-4xl border-none bg-transparent p-0 shadow-none"
            overlayClassName="bg-background/80 backdrop-blur-sm"
          >
            <Carousel
              opts={{ startIndex: selectedIndex, loop: true }}
              className="w-full"
            >
              <CarouselContent>
                {images.map((img) => (
                  <CarouselItem key={img.id}>
                    <div className="flex aspect-video items-center justify-center rounded-xl border border-border bg-card">
                      <p className="text-base text-muted-foreground">
                        {img.alt}
                      </p>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="-left-12" />
              <CarouselNext className="-right-12" />
            </Carousel>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  )
}
