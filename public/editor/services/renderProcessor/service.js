import { addService } from 'vc-cake'
let processes = []
const Service = {
  add (promise) {
    processes.push(promise)
  },
  appAllDone () {
    return Promise.all(processes).then(() => {
      this.purge()
    })
  },
  purge () {
    processes = []
  }
}
addService('renderProcessor', Service)