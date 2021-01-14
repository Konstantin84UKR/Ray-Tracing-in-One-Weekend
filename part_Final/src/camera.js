import Ray from "./ray.js";

export default class Camera {
  constructor(lookfrom, lookat, vup, vfov, aspect_ratio) {
    this.lookfrom = lookfrom;
    this.lookat = lookat;
    this.vup = vup;
    this.aspect_ratio = aspect_ratio;
    this.aperture = 0.1;
    //  this.focus_dist = (lookfrom - lookat).length();

    this.theta = this.degrees_to_radians(vfov);
    this.h = Math.tan(this.theta / 2);
    this.viewport_heigth = 2 * this.h;
    this.viewport_width = aspect_ratio * this.viewport_heigth;
    //this.focal_length = 1.0;

    let w = glMatrix.vec3.create();
    let u = glMatrix.vec3.create();
    let v = glMatrix.vec3.create();

    glMatrix.vec3.sub(w, this.lookfrom, this.lookat);

    this.focus_dist = glMatrix.vec3.length(w);

    glMatrix.vec3.normalize(w, w);
    glMatrix.vec3.cross(u, this.vup, w);
    glMatrix.vec3.normalize(u, u);
    glMatrix.vec3.cross(v, w, u);

    this.w = w;
    this.u = u;
    this.v = v;

    this.origin = this.lookfrom;
    this.horizontal = glMatrix.vec3.create();
    glMatrix.vec3.scale(this.horizontal, u, this.viewport_width * this.focus_dist);

    this.vertical = glMatrix.vec3.create();
    glMatrix.vec3.scale(this.vertical, v, this.viewport_heigth * this.focus_dist);

    let vertical_2 = glMatrix.vec3.create();
    glMatrix.vec3.scale(vertical_2, this.vertical, 0.5);
    let horizontal_2 = glMatrix.vec3.create();
    glMatrix.vec3.scale(horizontal_2, this.horizontal, 0.5);

    let horizontal_2_minus_vertical_2 = glMatrix.vec3.create();

    let fw = glMatrix.vec3.create();
    glMatrix.vec3.copy(fw, w);
    glMatrix.vec3.scale(fw, fw, this.focus_dist);
    glMatrix.vec3.sub(horizontal_2_minus_vertical_2, vertical_2, fw);

    glMatrix.vec3.sub(horizontal_2_minus_vertical_2, horizontal_2, horizontal_2_minus_vertical_2);
    let lower_left_corrner = glMatrix.vec3.create();
    glMatrix.vec3.sub(lower_left_corrner, this.origin, horizontal_2_minus_vertical_2);

    this.lower_left_corrner = lower_left_corrner;
    this.lens_radius = this.aperture / 2;
  }

  get_ray(s, t) {
    let rd = glMatrix.vec3.create();
    glMatrix.vec3.scale(rd, this.ramdom_in_unit_disk(), this.lens_radius);
    //vec3 offset = u * rd.x() + v * rd.y();

    let u = glMatrix.vec3.create();
    let v = glMatrix.vec3.create();
    glMatrix.vec3.copy(u, this.u);
    glMatrix.vec3.copy(v, this.v);
    glMatrix.vec3.scale(u, u, rd[0]);
    glMatrix.vec3.scale(v, v, rd[1]);

    let offset = glMatrix.vec3.create();
    glMatrix.vec3.add(offset, u, v);

    ///////////////////////////////////
    let u_horizontal = glMatrix.vec3.create();
    let v_vertical = glMatrix.vec3.create();
    let dir = glMatrix.vec3.create();

    glMatrix.vec3.scale(u_horizontal, this.horizontal, s);
    glMatrix.vec3.scale(v_vertical, this.vertical, t);

    glMatrix.vec3.copy(dir, this.lower_left_corrner);
    glMatrix.vec3.add(dir, dir, u_horizontal);
    glMatrix.vec3.add(dir, dir, v_vertical);
    glMatrix.vec3.sub(dir, dir, this.origin);
    glMatrix.vec3.sub(dir, dir, offset);

    //glMatrix.vec3.normalize(dir, dir);
    let origin_offset = glMatrix.vec3.create();
    glMatrix.vec3.add(origin_offset, this.origin, offset);

    let ray = new Ray(origin_offset, dir);
    return ray;
  }

  degrees_to_radians(degrees) {
    return (degrees * Math.PI) / 180.0;
  }

  ramdom_in_unit_disk() {
    while (true) {
      let p = glMatrix.vec3.fromValues(Math.random(-1, 1), Math.random(-1, 1), 0);
      if (glMatrix.vec3.length(p) >= 1) continue;
      return p;
    }
  }
}
