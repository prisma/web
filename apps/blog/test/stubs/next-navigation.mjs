// `next/navigation` hooks need a router context; in a node test the only thing
// these components ask for is the current path.
export function usePathname() {
  return "/a-test-post";
}

export function useRouter() {
  return { push() {}, replace() {}, refresh() {}, back() {}, forward() {}, prefetch() {} };
}

export function useSearchParams() {
  return new URLSearchParams();
}
