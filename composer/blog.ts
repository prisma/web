import { initializeWebsite, website } from "./website.ts";

const service = website("blog", import.meta.url, "../apps/blog");
export default service;
export const initialize = () => initializeWebsite(service);
