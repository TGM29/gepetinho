import { getAssetFromKV } from '@cloudflare/kv-asset-handler';

/**
 * The DEBUG flag will do two things:
 * 1. We will skip caching on the edge, which makes it easier to debug.
 * 2. We will return an error message on exception in your Response.
 */
const DEBUG = false;

export default {
  async fetch(request, env, ctx) {
    /**
     * You can add custom logic to handle the request here
     */
    try {
      return await getAssetFromKV(
        {
          request,
          waitUntil: ctx.waitUntil.bind(ctx),
        },
        {
          cacheControl: {
            browserTTL: 60 * 60 * 24, // 24 hours
            edgeTTL: 60 * 60 * 24 * 7, // 7 days
            bypassCache: DEBUG,
          },
        }
      );
    } catch (e) {
      // Fall back to serving `/index.html` on errors
      if (DEBUG) {
        return new Response(e.message || e.toString(), {
          status: 500,
        });
      }
      try {
        let notFoundResponse = await getAssetFromKV(
          {
            request,
            waitUntil: ctx.waitUntil.bind(ctx),
          },
          {
            mapRequestToAsset: (req) => {
              const url = new URL(req.url);
              url.pathname = `/index.html`;
              return new Request(url.toString(), req);
            },
          }
        );
        return new Response(notFoundResponse.body, {
          ...notFoundResponse,
          status: 404,
        });
      } catch (e) {
        return new Response('Not Found', { status: 404 });
      }
    }
  },
}; 