export default class Ray {
    constructor(origin, direction) {
        this._origin = origin;
        this._direction = direction;
        //this.t = 1;
    }
    get origin() {
        return this._origin;

    }
    get direction() {
        return this._direction;
    }

    getAt(t) {
        return this._origin + t * this._direction;
    }

}