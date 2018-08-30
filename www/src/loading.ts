let callback: (n: number)=>void
let loading: number = 0

const notify = () => {
  if (callback) {
    callback(loading)
  }
}

export const setCallback = (f: (n: number) => void) => {
  callback = f
}

export const incr = () => {
  loading += 1
  notify()
}

export const decr = () => {
  loading -= 1
  if (loading < 0) {
    console.warn('loading is negative', loading)
  }
  notify()
}
