import Ray from "./ray.js";

export default class Camera {
    constructor(image_width, image_heigth) {
        this.aspect_ratio = image_width / image_heigth;
        this.viewport_heigth = 2.0;
        this.viewport_width = this.aspect_ratio * this.viewport_width;
        this.focal_length = 100.0;

        this.origin = glMatrix.vec3.fromValues(0, 0, 0.0);
        this.horizontal = glMatrix.vec3.fromValues(this.viewport_width, 0, 0);
        this.vertical = glMatrix.vec3.fromValues(0, this.viewport_width, 0);


    }

    get_ray(u, v) {
        let dir = glMatrix.vec3.fromValues(u, v, -1.0);
        glMatrix.vec3.normalize(dir, dir);
        let ray = new Ray(this.origin, dir);
        return ray;
    }


}