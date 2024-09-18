"use client";

// ---------------------------
// ---------------------------

import { HTMLAttributes, useEffect, useRef, useState } from "react";
import MaxWidthWrapper from "./MaxWidthWrapper";
import { useInView } from "framer-motion";
import { cn } from "@/lib/utils";
import Phone from "./Phone";

// ---------------------------
// ---------------------------

// we gonno show 6 phones
const PHONES = [
  "/testimonials/1.jpg",
  "/testimonials/2.jpg",
  "/testimonials/3.jpg",
  "/testimonials/4.jpg",
  "/testimonials/5.jpg",
  "/testimonials/6.jpg",
];

// ---------------------------
// ---------------------------

// this T generic if we pass string array then this T is going to be string and all this does is it checks this T is string. All this allos us to do  is to enforce type safty in this function
function splitArray<T>(array: Array<T>, numParts: number) {
  // whatever kind of array it is we can store that to the result. T is generic
  //   colum row of string Array<Array<T>>
  const result: Array<Array<T>> = [];

  //   so all we are doing here is splitting an array into a certain nember of parts
  for (let i = 0; i < array.length; i++) {
    const index = i % numParts;
    if (!result[index]) {
      result[index] = [];
    }
    result[index].push(array[i]);
  }

  return result;
}

// ---------------------------
// ---------------------------

function ReviewColumn({
  // reviews is phones images
  reviews,
  className,
  reviewClassName,
  // how fast these things move
  msPerPixel = 0,
}: {
  reviews: string[];
  className?: string;
  reviewClassName?: (reviewIndex: number) => string;
  msPerPixel?: number;
}) {
  const columnRef = useRef<HTMLDivElement | null>(null);
  const [columnHeight, setColumnHeight] = useState(0);
  // change the speed of animations
  const duration = `${columnHeight * msPerPixel}ms`;

  useEffect(() => {
    if (!columnRef.current) return;

    // listen to the resizeing in the window
    // it is just in mamory and not in use but to use it...
    const resizeObserver = new window.ResizeObserver(() => {
      // just to make typescrip^t happy what it does is if it is undefined return 0
      setColumnHeight(columnRef.current?.offsetHeight ?? 0);
    });

    // to use it we need this
    resizeObserver.observe(columnRef.current);

    // clean memory leak
    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div
      ref={columnRef}
      className={cn("animate-marquee space-y-8 py-4", className)}
      style={{ "--marquee-duration": duration } as React.CSSProperties}
    >
      {reviews.concat(reviews).map((imgSrc, reviewIndex) => (
        // and in each review column we want to show the individual enlemnts / individual reviews
        <Review
          key={reviewIndex}
          // only if it is invloved reviewClassName then we can invoke it
          className={reviewClassName?.(reviewIndex % reviews.length)}
          imgSrc={imgSrc}
        />
      ))}
    </div>
  );
}

// ---------------------------
// ---------------------------

// allow us to pass any props that a normal react div would also take
interface ReviewProps extends HTMLAttributes<HTMLDivElement> {
  imgSrc: string;
}

// ---------------------------

// 1:49
function Review({ imgSrc, className, ...props }: ReviewProps) {
  // choose some random delays
  const POSSIBLE_ANIMATION_DELAYS = [
    "0s",
    "0.1s",
    "0.2s",
    "0.3s",
    "0.4s",
    "0.5s",
  ];

  const animationDelay =
    POSSIBLE_ANIMATION_DELAYS[
      Math.floor(Math.random() * POSSIBLE_ANIMATION_DELAYS.length)
    ];

  return (
    <div
      className={cn(
        "animate-fade-in rounded-[2.25rem] bg-white p-6 opacity-0 shadow-xl shadow-slate-900/5",
        className
      )}
      style={{ animationDelay }}
      {...props}
    >
      <Phone imgSrc={imgSrc} />
    </div>
  );
}

// ---------------------------
// ---------------------------

function ReviewGrid() {
  // in order to use react hook like useRef we need to mark it with client side
  //   why do we have continer ref is when we scroll on the main page. As the user scrools we only start animating this sections. Onces the user see it. In order to check if the animation is in the view of the user we can use this container ref along with react animation libraries which is framer motion this gives really usefull hock to check if something is in the viewport called use in view
  const containerRef = useRef<HTMLDivElement | null>(null);
  // only the first time animatie so onces
  const isInView = useInView(containerRef, { once: true, amount: 0.4 });
  //   wanna split these phone in 3 different column
  const columns = splitArray(PHONES, 3);
  const column1 = columns[0];
  const column2 = columns[1];
  const column3 = splitArray(columns[2], 2);

  return (
    <div
      // this div will act as a container for the following entire review grid
      ref={containerRef}
      className="relative -mx-4 mt-16 grid h-[49rem] max-h-[150vh] grid-cols-1 items-start gap-8 overflow-hidden px-4 sm:mt-20 md:grid-cols-2 lg:grid-cols-3"
    >
      {isInView ? (
        <>
          {/* it going to be one of these columns contining multiple phone elements */}
          {/* if we have one reiewcolum then we want to show all the image in that column */}
          <ReviewColumn
            // cloumn3 is array array so use flat to make it single array
            reviews={[...column1, ...column3.flat(), ...column2]}
            reviewClassName={(reviewIndex) =>
              cn({
                "md:hidden": reviewIndex >= column1.length + column3[0].length,
                "lg:hidden": reviewIndex >= column1.length,
              })
            }
            msPerPixel={10}
          />
          <ReviewColumn
            reviews={[...column2, ...column3[1]]}
            className="hidden md:block"
            reviewClassName={(reviewIndex) =>
              reviewIndex >= column2.length ? "lg:hidden" : ""
            }
            msPerPixel={15}
          />
          <ReviewColumn
            reviews={column3.flat()}
            className="hidden md:block"
            msPerPixel={10}
          />
        </>
      ) : null}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-slate-100" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-100" />
    </div>
  );
}

// ---------------------------
// ---------------------------

export function Reviews() {
  return (
    <MaxWidthWrapper className="relative max-w-5xl">
      <img
        aria-hidden="true"
        src="/what-people-are-buying.png"
        className="absolute select-none hidden xl:block -left-32 top-1/3"
      />

      <ReviewGrid />
    </MaxWidthWrapper>
  );
}
