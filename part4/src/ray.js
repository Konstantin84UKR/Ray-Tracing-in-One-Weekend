
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
        let v = glMatrix.vec3.create();
        glMatrix.vec3.scale(v, this._direction, t);
        glMatrix.vec3.add(v, this._origin, v);
        return v;
    }

}
