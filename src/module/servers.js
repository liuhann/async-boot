import contextProto from "../utils/context";

export default async (ctx, next) => {

    /**
     * Making page ctx
     * @returns {contextProto}
     */
    getContext() {
        const ctx = Object.create(contextProto)
        ctx.bootstrap = this

        //Register ctx.servers.xxx
        if (this.servers) {
            ctx.servers = {}
            for(const key in this.servers) {
                //each server has different config
                ctx.servers[key] = new HttpClient(this.servers[key])
                if (key === 'default') { //register default to ctx.server
                    ctx.server = ctx.servers[key]
                }
            }
        } else {
            //未进行server配置的话，会默认初始化一个不进行url改写的client
            ctx.server = new HttpClient()
        }
        return ctx
    }

}