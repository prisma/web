import { initializeWebsite, website } from "./website.ts";

const service = website("handbook", import.meta.url, "../apps/handbook");
export default service;
export const initialize = () => initializeWebsite(service);
