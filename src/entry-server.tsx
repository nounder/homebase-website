// @refresh reload
import { createHandler, StartServer } from "@solidjs/start/server"

export default createHandler(() => (
  <StartServer
    document={({ assets, children, scripts }) => (
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
          <meta property="og:image" content="/OpenGraphImage.png" />
          <meta
            name="description"
            content="Homebase organizes events, hacker houses, and workshops for builders and creators"
          />
          <meta name="theme-color" content="#1761ff" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="anonymous"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700;900&display=swap"
            rel="stylesheet"
          />

          {assets}
        </head>
        <body>
          <div id="app">
            {children}
          </div>
          {scripts}
        </body>
      </html>
    )}
  />
))
