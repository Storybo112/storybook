import os from 'os';

import { logger } from '@storybook/node-logger';
import detectFreePort from 'detect-port';

export function getServerAddresses(
  port: number,
  host: string | undefined,
  proto: string,
  initialPath?: string
) {
  const address = new URL(`${proto}://localhost:${port}/`);
  const networkAddress = new URL(`${proto}://${host || getLocalIp()}:${port}/`);

  if (initialPath) {
    const searchParams = `?path=${decodeURIComponent(
      initialPath.startsWith('/') ? initialPath : `/${initialPath}`
    )}`;
    address.search = searchParams;
    networkAddress.search = searchParams;
  }

  return {
    address: address.href,
    networkAddress: networkAddress.href,
  };
}

export const getServerPort = (port?: number) =>
  detectFreePort(port).catch((error) => {
    logger.error(error);
    process.exit(-1);
  });

export const getServerChannelUrl = (port: number, { https }: { https?: boolean }) => {
  return `${https ? 'wss' : 'ws'}://localhost:${port}/storybook-server-channel`;
};

const getLocalIp = () => {
  const allIps = Object.values(os.networkInterfaces()).flat();
  const allFilteredIps = allIps.filter(
    (networkAddress) =>
      networkAddress && networkAddress.family === 'IPv4' && !networkAddress.internal
  );

  return allFilteredIps[0]?.address || '127.0.0.1';
};