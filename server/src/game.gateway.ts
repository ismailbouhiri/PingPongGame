import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';

@WebSocketGateway()
export class GameGateway
{
    @WebSocketServer()
    server;

    @SubscribeMessage('server')
    checkConnection(@MessageBody() msg: string) : void
    {
        console.log(msg);
        this.server.emit('game', msg);
    }
}
