/// <reference path="../../typings.d.ts" />

import { global } from '@storybook/global';
import { pretty } from '@storybook/core/client-logger';
import { isJSON, parse, stringify } from 'telejson';
import invariant from 'tiny-invariant';

import * as EVENTS from '@storybook/core/core-events';
import type { ChannelTransport, ChannelHandler, Config, ChannelBrowserPage } from '../types';

import { formatChannelPage, formatEventType } from '../formatChannelEvent';

const { WebSocket } = global;

type OnError = (message: Event) => void;

interface WebsocketTransportArgs extends Partial<Config> {
  page: ChannelBrowserPage;
  url: string;
  onError: OnError;
}

export class WebsocketTransport implements ChannelTransport {
  private page: ChannelBrowserPage;

  private buffer: string[] = [];

  private handler?: ChannelHandler;

  private socket: WebSocket;

  private isReady = false;

  constructor({ url, onError, page }: WebsocketTransportArgs) {
    this.page = page;
    this.socket = new WebSocket(url);
    this.socket.onopen = () => {
      this.isReady = true;
      this.flush();
    };
    this.socket.onmessage = this.handleEvent.bind(this);
    this.socket.onerror = (e) => {
      if (onError) {
        onError(e);
      }
    };
    this.socket.onclose = () => {
      invariant(this.handler, 'WebsocketTransport handler should be set');
      this.handler({ type: EVENTS.CHANNEL_WS_DISCONNECT, args: [], from: page || 'preview' });
    };
  }

  setHandler(handler: ChannelHandler) {
    this.handler = handler;
  }

  send(event: any) {
    if (!this.isReady) {
      this.sendLater(event);
    } else {
      this.sendNow(event);
    }
  }

  private sendLater(event: any) {
    this.buffer.push(event);
  }

  private sendNow(event: any) {
    const data = stringify(event, {
      maxDepth: 15,
      allowFunction: false,
      ...global.CHANNEL_OPTIONS,
    });
    this.socket.send(data);
  }

  private flush() {
    const { buffer } = this;
    this.buffer = [];
    buffer.forEach((event) => this.send(event));
  }

  private handleEvent({ data }: MessageEvent) {
    const event = typeof data === 'string' && isJSON(data) ? parse(data) : data;
    const pageString = formatChannelPage(this.page);
    const eventString = formatEventType(event.type);
    const message = `${pageString} 
    received ${eventString} 
    (${data.length})`;
    pretty.debug(message, ...event.args);
    invariant(this.handler, 'WebsocketTransport handler should be set');
    this.handler(event);
  }
}
