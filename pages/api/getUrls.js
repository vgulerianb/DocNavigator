import { load } from "cheerio";
import axios from "axios";

const handler = async (req, res) => {
  const params = req.params;
  const queryParams = req.query;
  const bodyParams = req.body;
  const request = { ...params, ...queryParams, ...bodyParams };
  if (!request?.url)
    return res.status(400).json({ success: false, message: "Invalid request" });
  const url = request?.url;
  let urlSet = new Set();
  console.log("url", url);
  if (request?.type === "scrape") {
    urlSet = await getUrls(url);
  } else {
    await axios
      .get(url)
      .then((response) => {
        console.log("response", response.data);
        response.data.split("<loc>").forEach((url) => {
          if (url.includes("https://")) {
            urlSet.add(url.split("</loc>")[0]);
          }
        });
      })
      .catch((e) => {
        console.log("sitemap", url, e);
      });
  }
  if (urlSet?.size === 0)
    return res.status(400).json({ success: false, message: "No urls found" });
  console.log("urlSet ###################");
  console.log("urlSet ###################");
  console.log("urlSet ###################");
  console.log("urlSet ###################");
  console.log("urlSet ###################");
  console.log("urlSet ###################");
  console.log("urlSet ###################");
  console.log("urlSet ###################");
  res.status(200).json({ success: false, data: Array.from(urlSet) });
};

export default handler;

const getUrls = async (url, depth = 0) => {
  let urlSet = new Set();
  let isError = false;
  const html = await axios.get(url).catch((e) => {
    // console.log("html", url, e);
    isError = true;
  });
  if (isError) return urlSet;
  const $ = load(html.data);
  for (const el of $("a")) {
    const baseUrl = "https://" + url.split("/")[2];
    let lastUrl = "";
    if ($(el).attr("href"))
      if (
        $(el).attr("href")?.includes("http") &&
        $(el).attr("href")?.includes(baseUrl)
      ) {
        urlSet.add($(el).attr("href"));
        lastUrl = $(el).attr("href")?.split("#")[0];
      } else if (!$(el).attr("href")?.includes("http")) {
        const absoluteUrl = new URL(el.attribs.href, baseUrl).href;
        urlSet.add(absoluteUrl?.split("#")[0]);
        lastUrl = absoluteUrl;
      }
    if (!depth) {
      if (lastUrl) {
        const childUrls = await getUrls(lastUrl, 1);
        const urlsArray = Array.from(childUrls);
        for (let i = 0; i < urlsArray.length; i++) {
          urlSet.add(urlsArray[i]);
        }
      }
    }
  }
  return urlSet;
};
