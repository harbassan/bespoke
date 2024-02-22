import { Registry } from "./registry.js";
import { internalRegisterTransform } from "/hooks/transforms/transforms.js";
const registry = new Registry();
export default registry;
globalThis.__renderRoutes = registry.getItems.bind(registry);
internalRegisterTransform({
    transform: emit => str => {
        str = str.replace(/(\(0,([\w_$]+)\.jsx\)\(([\w_$\.]+),path:"\/search\/\*")/, "...__renderRoutes(),$1");
        emit();
        return str;
    },
    glob: /^\/xpui\.js/,
});
