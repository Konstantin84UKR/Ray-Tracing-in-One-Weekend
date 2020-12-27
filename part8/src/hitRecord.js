
export default class hitRecord {

    constructor() {
        this.p = glMatrix.vec3.create();
        this.normal = glMatrix.vec3.create();
        this.t = 0;
        this.front_face = false;
    }

    set_face_normal(ray, outward_normal) {
        this.front_face = glMatrix.vec3.dot(ray.direction, outward_normal) < 0;
        let outward_normal_negate = glMatrix.vec3.create();
        glMatrix.vec3.negate(outward_normal_negate, outward_normal);
        // this.normal = this.front_face ? outward_normal : outward_normal_negate;
        if (this.front_face) {
            this.normal = outward_normal;
        } else {
            this.normal = outward_normal_negate;
        }
    }
}
