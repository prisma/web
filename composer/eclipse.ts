import { initializeWebsite, website } from "./website.ts";

const service = website("eclipse", import.meta.url, "../apps/eclipse");
export default service;
export const initialize = () => initializeWebsite(service);
