import handler from "serve-handler";

import https, { RequestOptions } from "node:https";

export const server = (options: RequestOptions, config: any) =>
  https.createServer(options, (request, response) => {
    // You pass two more arguments for config and middleware
    // More details here: https://github.com/vercel/serve-handler#options
    const { renderSingle, cleanUrls, contenPublic, rewrites } = config;
    return handler(request, response, {
      renderSingle: renderSingle,
      cleanUrls: cleanUrls,
      public: contenPublic,
      rewrites: rewrites,
      headers: [
        {
          source: "**/*.@(jpg|jpeg|gif|png)",
          headers: [
            {
              key: "Cache-Control",
              value: "max-age=7200",
            },
          ],
        },
      ],
    });
  });
