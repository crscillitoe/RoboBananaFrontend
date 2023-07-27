import { environment } from "src/environments/environment";

export function getBaseStreamURL() {
    if (environment.streamURL) return environment.streamURL;
    let streamURL = decodeURIComponent(window.location.search);
    streamURL = streamURL.slice(1, streamURL.length - 1);
    return streamURL;
}