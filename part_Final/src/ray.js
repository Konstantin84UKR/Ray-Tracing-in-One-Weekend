
export default class Ray {
    constructor(origin, direction) {
        this.origin = origin;
        this.direction = direction;
        this.t = 1.0;
    }

    getAt(t) {

        let v = glMatrix.vec3.create();
        glMatrix.vec3.scale(v, this.direction,  t);
        glMatrix.vec3.add(v, this.origin, v);
        return v;
    }

    copy() {
        let r = new Ray(this.origin, this.direction);
        return r;
    }
    length_squared(e) {
        return e[0] * e[0] + e[1] * e[1] + e[2] * e[2];
    }
}