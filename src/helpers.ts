import { Client, isFullPage } from "@notionhq/client";
import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import fs from "fs-extra";
import path from "path";
import axios from "axios";

const MAX_NOTION_RETRIES = 5;
const RETRYABLE_STATUSES = new Set([429, 500, 502, 503, 504]);

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Notion's public API rate-limits bursts (~3 req/s); wait for retry-after
// instead of failing the whole build on a single 429.
async function fetchWithRetry(
  url: string,
  init?: Parameters<typeof fetch>[1],
): Promise<Response> {
  for (let attempt = 1; ; attempt++) {
    const response = await fetch(url, init);
    if (!RETRYABLE_STATUSES.has(response.status) || attempt >= MAX_NOTION_RETRIES)
      return response;
    const retryAfterSeconds = Number(response.headers.get("retry-after")) || 2 ** attempt;
    console.warn(
      `[Warn] Notion API returned ${response.status}, retrying in ${retryAfterSeconds}s (attempt ${attempt}/${MAX_NOTION_RETRIES})`,
    );
    await sleep(retryAfterSeconds * 1000);
  }
}

export function createNotionClient(): Client {
  return new Client({
    auth: process.env.NOTION_TOKEN,
    fetch: fetchWithRetry,
  });
}

export function getPageTitle(page: PageObjectResponse): string {
  const title = page.properties.Name ?? page.properties.title;
  if (title.type === "title") {
    return title.title.map((text) => text.plain_text).join("");
  }
  throw Error(
    `page.properties.Name has type ${title.type} instead of title. The underlying Notion API might has changed, please report an issue to the author.`,
  );
}

export async function getCoverLink(
  page_id: string,
  notion: Client,
): Promise<{ link: string; expiry_time: string | null } | null> {
  const page = await notion.pages.retrieve({ page_id });
  if (!isFullPage(page)) return null;
  if (page.cover === null) return null;
  if (page.cover.type === "external")
    return {
      link: page.cover.external.url,
      expiry_time: null,
    };
  else
    return {
      link: page.cover.file.url,
      expiry_time: page.cover.file.expiry_time,
    };
}

export function getFileName(title: string, page_id: string): string {
  return (
    title.replaceAll(" ", "-").replace(/--+/g, "-") +
    "-" +
    page_id.replaceAll("-", "") +
    ".md"
  );
}

export async function downloadCoverImage(
  url: string,
  pageId: string,
): Promise<string> {
  const uploadsDir = "static/uploads"
  fs.ensureDirSync(uploadsDir)

  // Extract file extension from URL or default to jpg
  const urlPath = new URL(url).pathname
  const ext = path.extname(urlPath) || ".jpg"
  const filename = `cover-${pageId.replaceAll("-", "")}${ext}`
  const filepath = path.join(uploadsDir, filename)

  const response = await axios.get(url, { responseType: "arraybuffer" })
  fs.writeFileSync(filepath, response.data)

  return `/uploads/${filename}`
}
