import { _ } from "/hooks/deps.js";
import { SpotifyLoc } from "../delulib/util.js";
import { CONFIG } from "./settings.js";
import { S, SVGIcons, extend } from "../std/index.js";
import { useMenuItem } from "../std/registers/menu.js";
import { createIconComponent } from "../std/api/createIconComponent.js";
const { URI } = S;
const History = S.Platform.getHistory();
const RootlistAPI = S.Platform.getRootlistAPI();
const createAnonRadio = (uri) => {
    const sse = new EventSource(`https://open.spoqify.com/anonymize?url=${uri.substring(8)}`);
    sse.addEventListener("done", e => {
        sse.close();
        const anonUri = URI.fromString(e.data);
        History.push(anonUri.toURLPath(true));
        RootlistAPI.add([anonUri.toURI()], SpotifyLoc.after.fromUri(CONFIG.anonymizedRadiosFolderUri));
    });
};
export default function (_module) {
    const module = extend(_module);
    const { registrar } = module;
    registrar.register("menu", S.React.createElement(() => {
        const { props } = useMenuItem();
        const uri = props.uri;
        return (S.React.createElement(S.ReactComponents.MenuItem, { disabled: false, onClick: () => {
                createAnonRadio(uri);
            }, leadingIcon: createIconComponent({
                icon: SVGIcons.podcasts,
            }) }, "Create anonymized radio"));
    }), ({ props }) => {
        return _.overSome([URI.is.Album, URI.is.Artist, URI.is.PlaylistV1OrV2, URI.is.Track])(props?.uri);
    });
    registrar.register("menu", S.React.createElement(() => {
        const { props } = useMenuItem();
        const uri = props.uri;
        return (S.React.createElement(S.ReactComponents.MenuItem, { disabled: false, onClick: () => {
                CONFIG.anonymizedRadiosFolderUri = uri;
            }, leadingIcon: createIconComponent({
                icon: SVGIcons["playlist-folder"],
            }) }, "Choose for Anonymized Radios"));
    }), ({ props }) => {
        return URI.is.Folder(props?.reference?.uri);
    });
}
