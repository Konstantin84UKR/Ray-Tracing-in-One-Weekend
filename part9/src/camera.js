import Ray from "./ray.js";

export default class Camera {
  // constructor(image_width, image_heigth) {
  //   this.aspect_ratio = image_width / image_heigth;
  //   this.viewport_heigth = 2.0;
  //   this.viewport_width = this.aspect_ratio * this.viewport_width;
  //   this.focal_length = 100.0;

  //   this.origin = glMatrix.vec3.fromValues(-0.0, 0.0, 0.0);
  //   this.horizontal = glMatrix.vec3.fromValues(this.viewport_width, 0, 0);
  //   this.vertical = glMatrix.vec3.fromValues(0, this.viewport_width, 0);
  // }

  constructor(lookfrom, lookat, vup, vfov, aspect_ratio) {
    this.lookfrom = lookfrom;
    this.lookat = lookat;
    this.vup = vup;
    this.aspect_ratio = aspect_ratio;
    //this.aperture = 2.0,

    //this.focus_dist = (lookfrom-lookat).length();

    this.theta = this.degrees_to_radians(vfov);
    this.h = Math.tan(this.theta / 2);
    this.viewport_heigth = 2 * this.h;
    this.viewport_width = aspect_ratio * this.viewport_heigth;
    this.focal_length = 1.0;

    let w = glMatrix.vec3.create();
    let u = glMatrix.vec3.create();
    let v = glMatrix.vec3.create();

    glMatrix.vec3.sub(w, this.lookfrom, this.lookat);

    //this.focus_dist = glMatrix.vec3.length(w);

    glMatrix.vec3.normalize(w, w);
    glMatrix.vec3.cross(u, this.vup, w);
    glMatrix.vec3.normalize(u, u);
    glMatrix.vec3.cross(v, w, u);

    this.origin = this.lookfrom;
    this.horizontal = glMatrix.vec3.create();
    glMatrix.vec3.scale(this.horizontal, u, this.viewport_width);

    this.vertical = glMatrix.vec3.create();
    glMatrix.vec3.scale(this.vertical, v, this.viewport_heigth);

    //  lower_left_corner = origin - horizontal/2 - vertical/2 - vec3(0, 0, focal_length);
    //lower_left_corner = origin - horizontal/2 - vertical/2 - w;

    // let horizontal_2 = glMatrix.vec3.fromValues(this.horizontal[0] / 4, this.horizontal[1] / 4, this.horizontal[2] / 4);
    //let vertical_2 = glMatrix.vec3.fromValues(this.vertical[0] / 4, this.vertical[1] / 4, this.vertical[2] / 4);
    //let focal_length_vector = glMatrix.vec3.fromValues(0.0, 0.0, this.focal_length);

    let vertical_2 = glMatrix.vec3.create();
    glMatrix.vec3.scale(vertical_2, this.vertical, 0.5);
    let horizontal_2 = glMatrix.vec3.create();
    glMatrix.vec3.scale(horizontal_2, this.horizontal, 0.5);


    let horizontal_2_minus_vertical_2 = glMatrix.vec3.create();
    glMatrix.vec3.sub(horizontal_2_minus_vertical_2, vertical_2, w);


    glMatrix.vec3.sub(horizontal_2_minus_vertical_2, horizontal_2, horizontal_2_minus_vertical_2);
    let lower_left_corrner = glMatrix.vec3.create();
    glMatrix.vec3.sub(lower_left_corrner, this.origin, horizontal_2_minus_vertical_2);

    this.lower_left_corrner = lower_left_corrner;
  }

  get_ray(s, t) {
    let dir2 = glMatrix.vec3.fromValues(s, t, -1.0);
    glMatrix.vec3.normalize(dir2, dir2);
    //let ray = new Ray(this.origin, dir);
    //lower_left_corner + s*horizontal + t*vertical - origin
    //return ray(origin, lower_left_corner + u*horizontal + v*vertical - origin);

    let u_horizontal = glMatrix.vec3.create();
    let v_vertical = glMatrix.vec3.create();
    let dir = glMatrix.vec3.create();

    let vertical_2 = glMatrix.vec3.create();
    glMatrix.vec3.scale(vertical_2, this.vertical, 4.0);
    let horizontal_2 = glMatrix.vec3.create();
    glMatrix.vec3.scale(horizontal_2, this.horizontal, 8.0);

    glMatrix.vec3.scale(u_horizontal, this.horizontal, s);
    glMatrix.vec3.scale(v_vertical, this.vertical, t);

    glMatrix.vec3.sub(dir, v_vertical, this.origin);
    glMatrix.vec3.add(dir, u_horizontal, dir);
    glMatrix.vec3.add(dir, this.lower_left_corrner, dir);

    // glMatrix.vec3.normalize(dir, dir);
    let ray = new Ray(this.origin, dir);
    return ray;
  }

  degrees_to_radians(degrees) {
    return (degrees * Math.PI) / 180.0;
  }
}
