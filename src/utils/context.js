
/**
 * Page Context
 * Data\service\errors could be injected into context for global control and functional programming
 */
const contextProto = {

	servers: {},

    throwError(...args) {

    },

    /**
     * @param err
     */
    onError(err, vmapp) {

    },
}


export default contextProto;