import { Log } from "core/log";

export interface Request {
  url: string;
  headers?: any;
  body?: any;
}

export interface Response {
  statusCode: number;
  body: any;
}

export type Ports = {
  log?: Log;
}

export type Options = {
  failOnPurpose?: boolean,
}

const defaultOptions: Options = { };

export const get = (r: Request): Promise<Response> => createGet()(r);

export const createGet = (ports: Ports = {}, opts: Options = defaultOptions): (request: Request) => Promise<Response> => {
  return (r: Request) => {
    const request = require("request");

    return new Promise(function(resolve, reject){
      const blocked = ['airbnb', 'box'];
      const containsBlockedCompany = (url: string) => blocked.some(it => url.toLowerCase().includes(it));
      const isBlocked = containsBlockedCompany(r.url); 

      if (opts.failOnPurpose && isBlocked) {
        return reject(`The url <${r.url}> is rejected because it contains a name in <${blocked.join(', ')}>`);
      }

      try {
        request({
          method: 'get', 
          uri: r.url, 
          headers: {
            ...r.headers, 
            'User-agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:93.0) Gecko/20100101 Firefox/93.0'
          } 
        }, 
        (error: any, reply: any, body: any) => {
          if (error){
            reject(error);
            return;
          }
  
          resolve(reply);
        });
      }
      catch(e) {
        reject(e);
      }
    });
  }
}