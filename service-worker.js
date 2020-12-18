importScripts(
  'https://cdnjs.cloudflare.com/ajax/libs/workbox-sw/5.1.4/workbox-sw.min.js'
)
workbox.routing.registerRoute(
  ({ request }) => request.destination === 'image',
  new workbox.strategies.NetworkFirst()
)
