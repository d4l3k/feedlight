import * as protobuf from 'protobufjs/minimal'
import {feedlightpb} from './feedlightpb'

import {incr, decr} from './loading'

import * as Long from 'long'
protobuf.util.Long = Long
protobuf.configure()

const backendAddr = config.BACKEND_ADDR

function postData (url: string, body: Uint8Array): Promise<Uint8Array> {
  incr()

  // Default options are marked with *
  return fetch(url, {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/octet-stream',
      'Accept': 'application/octet-stream'
    },
    redirect: 'follow',
    referrer: 'no-referrer',
    body
  })
    .then(response => {
      return response.arrayBuffer().then(buf => {
        decr()

        const arr = new Uint8Array(buf)
        if (response.status !== 200) {
          const msg = feedlightpb.Status.decode(arr)
          throw new Error(
            `Error: ${response.status} - ${response.statusText}: ${msg.message}`
          )
        }

        return arr
      })
    })
}

class RPCImpl {
  private serviceName: string

  constructor (serviceName: string) {
    this.serviceName = serviceName
  }

  public rpcImpl (
    method: (protobuf.Method|protobuf.rpc.ServiceMethod<protobuf.Message<{}>, protobuf.Message<{}>>),
    requestData: Uint8Array,
    callback: protobuf.RPCImplCallback) {
    postData(`${backendAddr}/api/v1/${this.serviceName}/${method.name}`, requestData).then(resp => {
      callback(null, resp)
    }).catch(err => {
      console.error(err)
      callback(err)
    })
  }
}

const rpcService = (name: string) => {
  const impl = new RPCImpl(name)
  return impl.rpcImpl.bind(impl)
}

export const FeedbackService = new feedlightpb.FeedbackService(rpcService('FeedbackService'))
