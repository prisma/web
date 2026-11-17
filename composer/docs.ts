import { initializeWebsite, website } from "./website.ts";

const service = website("docs", import.meta.url, "../apps/docs");
export default service;
export const initialize = () => initializeWebsite(service);
