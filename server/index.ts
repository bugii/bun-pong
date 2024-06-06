const server = Bun.serve<{ username: string; roomId: string }>({
  port: 4444,
  fetch(req, server) {
    const url = new URL(req.url);

    const success = server.upgrade(req, {
      data: {
        username: url.searchParams.get("username"),
        roomId: url.searchParams.get("roomId"),
      },
    });
    if (success) {
      // Bun automatically returns a 101 Switching Protocols
      // if the upgrade succeeds
      return undefined;
    }

    // handle HTTP request normally
    return new Response("Hello world!");
  },
  websocket: {
    open(ws) {
      const msg = `joined ${ws.data.username} ${ws.data.roomId}`;
      ws.subscribe(ws.data.roomId);
      server.publish(ws.data.roomId, msg);
    },
    // this is called when a message is received
    async message(ws, message) {
      console.log(`Received ${message}`);
      // send back a message
      server.publish(
        ws.data.roomId,
        `${ws.data.roomId} ${ws.data.username} said: ${message}`,
      );
    },
  },
});

console.log(`Listening on ${server.hostname}:${server.port}`);

