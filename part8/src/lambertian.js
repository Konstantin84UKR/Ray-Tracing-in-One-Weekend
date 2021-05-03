import Ray from "./ray.js";
import * as Matrix from './gl-matrix.js';
import { ramdom_unit_vector } from './main.js';
import Material from "./material.js";

export default class Lambertian extends Material {
    constructor(c) {
        super();
        this.albedo = c;
    }

    scatter(r_in, rec, attenuation, scattered) {

        let scatter_direction = glMatrix.vec3.create();
       
        let target = glMatrix.vec3.create();
        let p_plus_n = glMatrix.vec3.create();
        let p_minus_tangent = glMatrix.vec3.create();

        let ramdom_in_unit = ramdom_unit_vector();
        // получаем случайный вектор от отчки каcания в пределах еденичной сферы
        glMatrix.vec3.add(p_plus_n, rec.p, rec.normal);
        glMatrix.vec3.add(target, p_plus_n, ramdom_in_unit);
        glMatrix.vec3.sub(scatter_direction, target, rec.p);

        if (this.near_zero(scatter_direction)) {
            scatter_direction = rec.normal;
        }

        scattered = new Ray(rec.p, scatter_direction);
        //attenuation = this.albedo;
        glMatrix.vec3.copy(attenuation, this.albedo);


        let struct_scatter = {
            scattered: scattered,
            attenuation: attenuation,
            result: true
        }


        return struct_scatter;
    }

    near_zero(e) {
        ///const s = Number.MIN_SAFE_INTEGER;
        const s = 0.01;
        return (Math.abs(e[0]) < s && Math.abs(e[1]) < s && Math.abs(e[2]) < s);
    }

}