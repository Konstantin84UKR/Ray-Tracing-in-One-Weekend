
export default class Ray {
    constructor(origin, direction) {
        this.origin = origin;
        this.direction = direction;
        this.t = 1;
    }

    getAt(t) {

        let v = glMatrix.vec3.create();
        glMatrix.vec3.scale(v, this.direction, t);
        glMatrix.vec3.add(v, this.origin, v);
        return v;
    }

}