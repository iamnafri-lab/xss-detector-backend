import { pubsub } from "../../../../../app";
import { start1 } from "./startDetection";

export let startDetection = {
    subscribe: (parent, args, ctx, info) => {
        start1(args.port, args.interface);
        return pubsub.asyncIterator('results');
    }
}

