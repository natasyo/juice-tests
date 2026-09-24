import { Options } from "k6/options";
import { LOAD_PROFILES, THRESHOLDS } from "../config/options.ts";
import { guestFlow } from "../flows/guest-flow.ts";

export const options: Options = {
    ...LOAD_PROFILES.load,
    thresholds: THRESHOLDS,
}

export default function () {
    guestFlow();
}