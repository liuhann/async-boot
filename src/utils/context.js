/**
 * Page Context
 * It is available since boot up
 */
const contextProto = {
  throwError (...args) {

  },
  onError (err) {
    console.log(err)
  }
}

export default contextProto
