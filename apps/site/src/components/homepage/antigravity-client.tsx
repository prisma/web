"use client";

import dynamic from "next/dynamic";

// next/dynamic with ssr:false must live in a Client Component.
// This wrapper lets the Server Component page import Antigravity
// without triggering the "ssr:false in Server Component" build error.
const Antigravity = dynamic(() => import("./antigravity"), { ssr: false });

export default Antigravity;
