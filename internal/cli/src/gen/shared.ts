import _ from 'lodash';

export const warnMessage =
  'THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.';

export const indent4 = (n: number) => _.repeat(' ', 4 * n);

export const renderJavaContants = (m: {[key: string]: string}) =>
  _.map(
    m,
    (v, k) =>
      `${indent4(2)}public static final String ${_.snakeCase(
        k
      ).toUpperCase()} = "${v}";`
  )
    .sort()
    .join('\n');

export const renderSwiftContants = (m: {[key: string]: string}) =>
  _.map(m, (v, k) => `${indent4(1)}static let ${_.camelCase(k)} = "${v}"`)
    .sort()
    .join('\n');

export const renderSwiftEnumCases = (m: {[key: string]: string}) =>
  _.map(m, (v, k) => `${indent4(1)}case ${_.camelCase(k)} = "${v}"`)
    .sort()
    .join('\n');

export const renderTsContants = (m: {[key: string]: string}) =>
  _.map(m, (v, k) => `  ${k} = '${v}',`)
    .sort()
    .join('\n');

export const buildUtils = (service: string, actionType = 'string') => `
export const execAsync = (action: ${actionType}, args?: any[]) => {
  return new Promise((resolve, reject) => {
    cordova.exec(resolve, reject, '${service}', action, args)
  })
}

export function fireDocumentEvent(eventName: string, data = undefined) {
  cordova.fireDocumentEvent(eventName, data)
}

export function waitEvent(
  successEvent: string,
  failEvent = '',
): Promise<CustomEvent> {
  return new Promise((resolve, reject) => {
    document.addEventListener(
      successEvent as any,
      (event: CustomEvent) => {
        resolve(event)
      },
      false,
    )

    if (failEvent) {
      document.addEventListener(
        failEvent as any,
        (failedEvent: CustomEvent) => {
          reject(failedEvent)
        },
        false,
      )
    }
  })
}

export const initPlugin = () => {
  document.addEventListener(
    'deviceready',
    () => {
      cordova.exec(
        (event) => {
          fireDocumentEvent(event.type, event.data)
        },
        console.error,
        '${service}',
        NativeActions.ready,
      )
    },
    false,
  )
}`;
