export * from "./static.js";
import { S as _S } from "./expose/expose.js";
export const S = _S;
import { Registrar } from "./registers/registers.js";
export const extend = (_module) => {
    const module = Object.assign(_module, {
        registrar: new Registrar(_module.name),
    });
    const unloadJS = module.unloadJS;
    module.unloadJS = () => {
        module.registrar.dispose();
        return unloadJS();
    };
    return module;
};
class Event {
    constructor(getArg) {
        this.getArg = getArg;
        this.callbacks = new Array();
    }
    on(callback) {
        callback(this.getArg());
        this.callbacks.push(callback);
    }
    fire() {
        const arg = this.getArg();
        for (const callback of this.callbacks)
            callback(arg);
    }
}
const PlayerAPI = S.Platform.getPlayerAPI();
const getPlayerState = () => PlayerAPI.getState();
export const Events = {
    Player: {
        update: new Event(getPlayerState),
        songchanged: new Event(getPlayerState),
    },
};
let cachedState = {};
PlayerAPI.getEvents().addListener("update", ({ data: state }) => {
    if (state?.item?.uri !== cachedState?.item?.uri)
        Events.Player.songchanged.fire();
    if (state?.isPaused !== cachedState?.isPaused)
        Events.Player.update.fire();
    cachedState = state;
});
