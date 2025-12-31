import {Point} from './point.js';

export function getDistance(point1: Point, point2: Point): number{
    const distance = parseFloat(Math.sqrt(((point2.x - point1.x) * (point2.x - point1.x)) - ((point2.x - point1.x) * (point2.x - point1.x))).toFixed(2));
    return distance;
}

export function slope(point1: Point, point2: Point): number | null {
    if(point1.x === point2.x){
        return null;
    }
        const slope = parseFloat((point2.y - point1.y).toPrecision(2)) / parseFloat((point2.x - point1.x).toPrecision(2));
        return slope;
}

