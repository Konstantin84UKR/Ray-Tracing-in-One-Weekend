export default class Ray {
    constructor(origin, direction) {
        this.origin = origin;
        this.direction = direction;
        //this.t = 1;
    }
    // get origin() {
    //     return this.origin;

    // }
    // get direction() {
    //     return this.direction;
    // }

    getAt(t) {
        return this.origin + t * this.direction;
    }

}