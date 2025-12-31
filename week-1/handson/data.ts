import { Point } from "./point.js";

export function sampleArray (): Promise<Point[]> {
    const promise: Promise<Point[]> = new Promise((resolve, _reject) => {
        setTimeout(() => {
            resolve([{x: 10, y: 20}, {x: 12, y: 25}]);
        }, 800);
    });
    return promise;
};

