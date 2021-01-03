import Ray from "./ray.js";
import * as Matrix from './gl-matrix.js';
import { ramdom_unit_vector } from './main.js';
import Material from "./material.js";

export default class Metal extends Material {
    constructor(c, f) {
        super();
        this.albedo = c;
        this.fuzz = (f < 1 ? f : 1);
    }

    scatter(r_in, rec, attenuation, scattered) {
        let scatter_direction = glMatrix.vec3.create();

        glMatrix.vec3.normalize(scatter_direction, r_in.direction);
        let reflected = this.reflect(scatter_direction, rec.normal);
        let fuzz_direction = glMatrix.vec3.create();
        glMatrix.vec3.scale(fuzz_direction, ramdom_unit_vector(), this.fuzz);

        glMatrix.vec3.add(reflected, reflected, fuzz_direction);
        glMatrix.vec3.normalize(reflected, reflected);


        // if (near_zero(e)) {
        //     scatter_direction = rec.normal;
        // }
        //Vec3f reflect_orig = reflect_dir*N < 0 ? point - N*1e-3 : point + N*1e-3; 
        let reflect_orig = glMatrix.vec3.create();
        // let reflect_orig_small = glMatrix.vec3.fromValues(0.000001, 0.000001, 0.000001);
        //  glMatrix.vec3.add(reflect_orig, rec.p, reflect_orig_small);
        scattered = new Ray(rec.p, reflected);
        //attenuation = this.albedo;
        glMatrix.vec3.copy(attenuation, this.albedo);
        let dot_dir_nor = glMatrix.vec3.dot(scattered.direction, rec.normal);

        // return (dot_dir_nor > 0);

        let struct_scatter = {
            scattered: scattered,
            attenuation: attenuation,
            result: (dot_dir_nor > 0.00001)
        }

        return struct_scatter;
    }

    // near_zero(e) {
    //     const s = Number.MIN_SAFE_INTEGER;
    //     return (Math.abs(e[0]) < s && Math.abs(e[1]) < s && Math.abs(e[2]) < s);
    // }

    // vec3 reflect(const vec3& v, const vec3& n) {
    //     return v - 2*dot(v,n)*n;
    // }

    // reflect(v, n) {
    //     // v = glMatrix.vec3.fromValues(1.0, 1.0, 0.0);
    //     // n = glMatrix.vec3.fromValues(0.0, 1.0, 0.0);
    //     glMatrix.vec3.normalize(v, v);
    //     glMatrix.vec3.normalize(n, n);

    //     let dot_vn = glMatrix.vec3.dot(v, n);
    //     let x = glMatrix.vec3.create();
    //     glMatrix.vec3.scale(x, n, dot_vn);
    //     glMatrix.vec3.scale(x, x, 2);
    //     glMatrix.vec3.sub(x, v, x);
    //     return x;

    // }

}