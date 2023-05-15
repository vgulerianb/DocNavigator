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
    const html = await axios.get(url).catch((e) => {
      console.log("html", url, e);
    });
    const $ = load(html.data);
    $("nav a").each((i, el) => {
      // console.log("el", el?.children?.[0]?.data);
      const baseUrl = "https://" + url.split("/")[2];
      if (el.attribs.href)
        if (
          el.attribs.href?.includes("http") &&
          el.attribs.href?.includes(baseUrl)
        ) {
          urlSet.add(el.attribs.href);
        } else if (!el.attribs.href?.includes("http")) {
          const absoluteUrl = new URL(el.attribs.href, baseUrl).href;
          urlSet.add(absoluteUrl);
        }
      console.log("content", urlSet);
    });
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
  console.log("urlSet", urlSet);
  if (urlSet?.size === 0)
    return res.status(400).json({ success: false, message: "No urls found" });
  res.status(200).json({ success: false, data: Array.from(urlSet) });
};

export default handler;
