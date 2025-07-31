import { serve } from "https://deno.land/std@0.192.0/http/server.ts"
import { serveDir } from "https://deno.land/std@0.192.0/http/file_server.ts"

serve(
    (req) => {
        return serveDir(req, {
            fsRoot: ".",
            showDirListing: true,
            enableCors: true,
        })
    },
    { port: 4545 }
)
