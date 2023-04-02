import WebSocket from 'ws';
import { AddressInfo } from 'net';
import { server } from '../../../src/app';
import { accessToken } from '../fixtures';

describe.only('WebSocket server', () => {
    let ws: WebSocket;
    let serverAddress: AddressInfo;

    beforeAll((done) => {
        serverAddress = server.address() as AddressInfo
        done();
    });

    afterAll(() => {
        server.close();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should connect successfully and keep the connection without disruption when accessToken is provided', (done) => {
        ws = new WebSocket(`ws://localhost:${serverAddress.port}/?accessToken=${accessToken}`);
        ws.on('open', () => {
            ws.close();
        });
        done();
    });
});

