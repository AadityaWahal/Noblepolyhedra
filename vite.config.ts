import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

function vercelApiDevPlugin() {
  return {
    name: 'vercel-api-dev',
    configureServer(server: any) {
      server.middlewares.use(async (req: any, res: any, next: any) => {
        if (!req.url?.startsWith('/api/')) {
          return next();
        }

        try {
          const url = new URL(req.url, `http://${req.headers.host || 'localhost:3000'}`);
          const pathname = url.pathname;

          const enhancedRes = res;
          enhancedRes.status = function (code: number) {
            this.statusCode = code;
            return this;
          };
          enhancedRes.json = function (data: unknown) {
            this.setHeader('Content-Type', 'application/json');
            this.end(JSON.stringify(data));
          };

          const enhancedReq = req;
          enhancedReq.query = Object.fromEntries(url.searchParams.entries());

          if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
            let body = '';
            req.on('data', (chunk: any) => {
              body += chunk;
            });
            await new Promise<void>(resolve => req.on('end', () => resolve()));
            try {
              enhancedReq.body = JSON.parse(body);
            } catch {
              enhancedReq.body = body;
            }
          }

          if (pathname === '/api/health') {
            const mod = await server.ssrLoadModule('/api/health.ts');
            return mod.default(enhancedReq, enhancedRes);
          }
          if (pathname === '/api/user-data') {
            const mod = await server.ssrLoadModule('/api/user-data.ts');
            return mod.default(enhancedReq, enhancedRes);
          }
          if (pathname === '/api/models') {
            const mod = await server.ssrLoadModule('/api/models.ts');
            return mod.default(enhancedReq, enhancedRes);
          }
          next();
        } catch (e: any) {
          console.error('API dev error:', e);
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: e.message }));
        }
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [vercelApiDevPlugin(), react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      // Exhibition security: disable source maps to prevent code inspection
      sourcemap: false,
      minify: 'esbuild' as const,
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
