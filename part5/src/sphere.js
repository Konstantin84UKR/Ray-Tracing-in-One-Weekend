import * as Matrix from './gl-matrix.js';

export default class Sphere {
    constructor(c, r) {
        this.center = c;
        this.radius = r;
        //this.matirial = m;
    }

    hit(ray, t_min, t_max, hitRecord) {

        let oc = glMatrix.vec3.create();
        glMatrix.vec3.subtract(oc, ray.origin, this.center);
        let dir = glMatrix.vec3.normalize(ray.direction, ray.direction);
        let a = glMatrix.vec3.dot(ray.direction, ray.direction);

        //let dot_oc_direction = glMatrix.vec3.dot(oc, ray.direction);
        let b = 2.0 * glMatrix.vec3.dot(oc, ray.direction);
        let half_b = glMatrix.vec3.dot(oc, ray.direction);

        let dot_c_c = glMatrix.vec3.dot(oc, oc);
        let c = dot_c_c - (this.radius * this.radius);

        let discriminant = (half_b * half_b) - (a * c);
        //let discriminant = (b * b) - (4 * a * c);
        //console.log("discriminant = " + discriminant);


        if (discriminant < 0) {
            return false;
        }
        // (-half_b - Math.sqrt(discriminant)) / (a);

        /////////////
        // vec3 oc = r.origin() - center;
        // auto a = r.direction().length_squared();
        // auto half_b = dot(oc, r.direction());
        // auto c = oc.length_squared() - radius*radius;

        // auto discriminant = half_b*half_b - a*c;
        // if (discriminant < 0) return false;
        // auto sqrtd = sqrt(discriminant);

        //////////

        let sqrtd = Math.sqrt(discriminant);
        //let sqrtd = discriminant * discriminant;
        let root = ((-half_b) - sqrtd) / a;

        if (root < t_min || t_max < root) {
            root = (-half_b + sqrtd) / a;
            if (root < t_min || t_max < root) {
                return false;
            }
        }

        hitRecord.t = root;
        hitRecord.p = ray.getAt(hitRecord.t);
        // glMatrix.vec3.normalize(hitRecord.p, hitRecord.p);
        //hitRecord.normal = (hitRecord.p - this.center) / this.radius;
        let N = glMatrix.vec3.create();
        glMatrix.vec3.subtract(N, hitRecord.p, this.center);

        // glMatrix.vec3.scale(N, hitRecord.p, 1 / this.radius);
        glMatrix.vec3.normalize(N, N);
        hitRecord.normal = N;
        hitRecord.set_face_normal(ray, hitRecord.normal);

        return true;

    }

}