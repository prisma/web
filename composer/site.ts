import { initializeWebsite, website } from "./website.ts";

const service = website("site", import.meta.url, "../apps/site");
export default service;
export const initialize = () => initializeWebsite(service);
