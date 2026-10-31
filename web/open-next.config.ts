// Settings for the OpenNext adapter, which turns the Next.js build into a Cloudflare Worker.
// The defaults are enough: this site has no pages that need a shared cache.
import { defineCloudflareConfig } from "@opennextjs/cloudflare";

export default defineCloudflareConfig({});
