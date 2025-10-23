# SpaceNet Software Architecture
Here we document how the pieces come together i guess

## Networking
As an example, movement logic:
```
<Player presses button>
|
V
Button press is handled
|
--> (optional) optimistic client side rendering
|
V
ClientConnection#sendPacket call with an instance of PlayerMoveC2SPacket (contains data such as x and y)
|
V
Buffer is allocated and packet id is written to it first
|
V
PlayerMoveC2SPacket#write is called (will write all of its data to the buffer, such as x and y)
|
V
WebSocket sends the buffer data to the server
--- SERVER ---
|
V
Server receives new WebSocket message
|
V
ServerConnection for this specific client is already created (ServerConnection handles the communication between the server and client)
|
V
ServerConnection#handleIncoming called with the raw WebSocket data
|
V
PacketRegistry#decode is called (PacketRegistry is a registry of all possible packets the server can receive)
|
V
PacketRegistry reads the packet id and attempts to find the packet with the specified id
|
--> If not found, throws an error
|
V
PacketRegistry should've found the PlayerMoveC2SPacket
|
V
PacketRegistry calls (static) PlayerMoveC2SPacket#read with the data
|
V
PlayerMoveC2SPacket creates a new instance of itself and reads the data (x, y) from the buffer and puts it into its x and y variables
|
V
PacketRegistry returns the newly created PlayerMoveC2SPacket
|
V
ServerConnection calls PlayerMoveC2SPacket#apply with its ServerPlayNetworkHandler instance.
|
V
PlayerMoveC2SPacket calls ServerPlayNetworkHandler#onPlayerMove with itself as the argument
|
V
ServerPlayNetworkHandler#onPlayerMove handles the player move logic. It gets the x and y values from the packet and moves the player accordingly. It should also send the movement packet to all other players afterwards, so that they are synced.


TLDR:
Player presses button -> Packet is created -> Packet is sent -> Server receives packet -> Server finds the correct class of the packet and creates it -> Server handles the movement now that it has a packet class, it knows the x and y that the client sent, it was read from the buffer by the packet's class
```
How a connection is established:
```
<Player loads page>
|
V
ClientManager is created and creates a whole bunch of things
|
V
ClientManager creates WebSocketClient instance
|
V
WebSocketClient connects to the websocket at the specified address.
|
V
--- SERVER ---
|
V
Server receives connection
|
V
Server creates a new ServerConnection instance, which will handle all of the networking with this specific client
|
V
--- CLIENT ---
|
V
Connection is established and the client can now send packets to the server and receive packets from the server
```