import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '404 - Page Not Found',
  description: 'The page you were looking for could not be found.',
};

export default function NotFound() {

  return (
    <main className="flex-1 w-full max-w-249 mx-auto px-4 py-8 z-1">
      <h1 className="stretch-display text-4xl font-bold mb-2 landing-h1 text-center mt-9 font-sans-display">
        Blog
      </h1>
      <div className="pt-6 pb-12 mt-10 mx-auto flex flex-col items-center justify-center">
            <h2
              style={{fontSize: 'clamp(4rem, 10vw, 9rem)'}}
              className="
              relative 
              mb-4 
              pointer-events-none 
              font-extrabold 

              before:content-[attr(data-text)] 
              before:absolute 
              before:top-0 
              before:left-[2px] 
              before:w-full 
              before:overflow-hidden 
              before:[text-shadow:-2px_0_red] 
              before:animate-[glitch-1_2s_infinite_linear_alternate-reverse] 

              after:content-[attr(data-text)] 
              after:absolute 
              after:top-0 
              after:-left-[2px] 
              after:w-full 
              after:overflow-hidden 
              after:[text-shadow:-2px_0_cyan] 
              after:animate-[glitch-2_1.5s_infinite_linear_alternate-reverse] 

              motion-reduce:before:animate-none 
              motion-reduce:after:animate-none"
              data-text="404"
            >
              404
            </h2>
            <p className="text-xl font-semibold mb-4">
              We could not find the page you were looking for
            </p>
            <Link href="/" className="text-xl hover:underline transition-colors">
              Back to Blog 
            </Link>
      </div>
    </main>
  );
}
