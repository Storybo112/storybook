import path from 'path';
import { sync } from 'pkg-dir';
import fs from 'fs';

const interpolate = (string: string, data: Record<string, string> = {}) =>
  Object.entries(data).reduce((acc, [k, v]) => {
    const escaped = k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return acc.replace(new RegExp(`%${escaped}%`, 'g'), v);
  }, string);

export function getPreviewBodyTemplate(
  configDirPath: string,
  interpolations?: Record<string, string>
) {
  const base = fs.readFileSync(`${sync(__dirname)}/templates/base-preview-body.html`, 'utf8');

  const bodyHtmlPath = path.resolve(configDirPath, 'preview-body.html');
  let result = base;

  if (fs.existsSync(bodyHtmlPath)) {
    result = fs.readFileSync(bodyHtmlPath, 'utf8') + result;
  }

  return interpolate(result, interpolations);
}

export function getPreviewHeadTemplate(
  configDirPath: string,
  interpolations?: Record<string, string>
) {
  const base = fs.readFileSync(`${sync(__dirname)}/templates/base-preview-head.html`, 'utf8');
  const headHtmlPath = path.resolve(configDirPath, 'preview-head.html');

  let result = base;

  if (fs.existsSync(headHtmlPath)) {
    result += fs.readFileSync(headHtmlPath, 'utf8');
  }

  return interpolate(result, interpolations);
}

export function getManagerHeadTemplate(
  configDirPath: string,
  interpolations: Record<string, string>
) {
  const base = fs.readFileSync(`${sync(__dirname)}/templates/base-manager-head.html`, 'utf8');
  const scriptPath = path.resolve(configDirPath, 'manager-head.html');

  let result = base;

  if (fs.existsSync(scriptPath)) {
    result += fs.readFileSync(scriptPath, 'utf8');
  }

  return interpolate(result, interpolations);
}

export function getManagerMainTemplate() {
  return `${sync(__dirname)}/templates/index.ejs`;
}

export function getPreviewMainTemplate() {
  return `${sync(__dirname)}/templates/index.ejs`;
}
