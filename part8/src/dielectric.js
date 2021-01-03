import Ray from "./ray.js";
import * as Matrix from './gl-matrix.js';
import { ramdom_unit_vector } from './main.js';
import Material from "./material.js";

export default class Dielectric extends Material {
    constructor(c, ir) {
        super();
        this.albedo = c;
        this.ir = ir;
    }

    scatter(r_in, rec, attenuation, scattered) {


        let refraction_ratio = rec.front_face ? (1.0 / this.ir) : this.ir;
        //--------------------------------------------- 
        let negate_r_in = glMatrix.vec3.create();
        glMatrix.vec3.negate(negate_r_in, r_in.direction);
        glMatrix.vec3.normalize(negate_r_in, negate_r_in);

        let normal_temp = glMatrix.vec3.create();
        glMatrix.vec3.normalize(normal_temp, rec.normal);

        let r_n_dot = glMatrix.vec3.dot(negate_r_in, normal_temp);
        let cos_theta = Math.min(r_n_dot, 1.0);
        //------------------------------------------- 

        //let sin_theta = sqrt(1.0 - cos_theta*cos_theta);
        let sin_theta = Math.sqrt(1.0 - cos_theta * cos_theta);
        let cannot_refract = refraction_ratio * sin_theta > 1.0;
        let scatter_direction = glMatrix.vec3.create();
        glMatrix.vec3.normalize(scatter_direction, r_in.direction);
        let schlick = this.reflectance(cos_theta, refraction_ratio);

        if (cannot_refract || schlick > Math.random()) {
            scatter_direction = this.reflect(scatter_direction, normal_temp);
        } else {
            scatter_direction = this.refract(scatter_direction, normal_temp, refraction_ratio);
        }

        scattered = new Ray(rec.p, scatter_direction);

        let struct_scatter = {
            scattered: scattered,
            attenuation: this.albedo,
            result: true
        }

        return struct_scatter;

    }

}