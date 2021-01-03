import * as Matrix from './gl-matrix.js';

export default class Material {

    constructor() {

    }

    scatter(r_in, rec, attenuation, scattered) {

        let struct_scatter = {
            scattered: glMatrix.vec3.create(),
            attenuation: glMatrix.vec3.create(),
            result: true
        }


        return struct_scatter;
    }


    reflect(v, n) {
        // v = glMatrix.vec3.fromValues(1.0, 1.0, 0.0);
        // n = glMatrix.vec3.fromValues(0.0, 1.0, 0.0);
        glMatrix.vec3.normalize(v, v);
        glMatrix.vec3.normalize(n, n);

        let dot_vn = glMatrix.vec3.dot(v, n);
        let x = glMatrix.vec3.create();
        glMatrix.vec3.scale(x, n, dot_vn);
        glMatrix.vec3.scale(x, x, 2);
        glMatrix.vec3.sub(x, v, x);
        return x;

    }

    // vec3 refract(const vec3& uv, const vec3& n, double etai_over_etat) {
    //     auto cos_theta = fmin(dot(-uv, n), 1.0);
    //     vec3 r_out_perp =  etai_over_etat * (uv + cos_theta*n);
    //     vec3 r_out_parallel = -sqrt(fabs(1.0 - r_out_perp.length_squared())) * n;
    //     return r_out_perp + r_out_parallel;
    // }

    refract(uv, normal, etai_over_etat) {
        let negate_r_in = glMatrix.vec3.create();
        glMatrix.vec3.negate(negate_r_in, uv);
        glMatrix.vec3.normalize(negate_r_in, negate_r_in);

        let normal_temp = glMatrix.vec3.create();
        glMatrix.vec3.normalize(normal_temp, normal);

        let r_n_dot = glMatrix.vec3.dot(negate_r_in, normal_temp);
        let cos_theta = Math.min(r_n_dot, 1.0);
        //-----------------------------------------------------
        let temp_c_n = glMatrix.vec3.create();
        let r_out_perp = glMatrix.vec3.create();

        glMatrix.vec3.scale(temp_c_n, normal, cos_theta)     // cos_theta * normal)
        glMatrix.vec3.add(temp_c_n, uv, temp_c_n);    // uv + (cos_theta * normal)
        glMatrix.vec3.scale(r_out_perp, temp_c_n, etai_over_etat); //etai_over_etat * (uv + cos_theta * normal);
        // let r_out_perp = etai_over_etat * (uv + cos_theta * normal);
        //---------------------------------------------------

        //vec3 r_out_parallel = -sqrt(fabs(1.0 - r_out_perp.length_squared()))
        let r_out_perp_dot = glMatrix.vec3.dot(r_out_perp, r_out_perp); // r_out_perp.length_squared()

        let temp_i = Math.sqrt(Math.abs(1.0 - r_out_perp_dot)) * -1;

        let r_out_parallel = glMatrix.vec3.create();
        glMatrix.vec3.scale(r_out_parallel, normal_temp, temp_i);
        //------------------------------------------------------------

        let return_vec = glMatrix.vec3.create();
        glMatrix.vec3.add(return_vec, r_out_perp, r_out_parallel);
        return return_vec;
    }


    reflectance(cosine, ref_idx) {
        // static double reflectance(double cosine, double ref_idx) {
        //     // Use Schlick's approximation for reflectance.
        //     auto r0 = (1-ref_idx) / (1+ref_idx);
        //     r0 = r0*r0;
        //     return r0 + (1-r0)*pow((1 - cosine),5);
        // }
        //------------------------------------------------------
        let r0 = (1 - ref_idx) / (1 + ref_idx);
        let r0_double = r0 * r0;
        return r0_double + (1 - r0_double) * Math.pow((1 - cosine), 5);

    }
}