import * as Matrix from './gl-matrix.js';

export default class Sphere {
    constructor(c, r) {
        this.center = c;
        this.radius = r;
        //this.matirial = m;
    }

    hit(ray, t_min, t_max, hitRecord) {

        // let oc = glMatrix.vec3.create();
        // glMatrix.vec3.subtract(oc, ray.origin, this.center);
        // // let dir = glMatrix.vec3.normalize(ray.direction, ray.direction);
        // let a = glMatrix.vec3.dot(ray.direction, ray.direction);

        // //let dot_oc_direction = glMatrix.vec3.dot(oc, ray.direction);
        // //let b = 2.0 * glMatrix.vec3.dot(oc, ray.direction);
        // let half_b = glMatrix.vec3.dot(oc, ray.direction);

        // let dot_c_c = glMatrix.vec3.dot(oc, oc);
        // let c = dot_c_c - (this.radius * this.radius);

        // let discriminant = (half_b * half_b) - (a * c);
        // //let discriminant = (b * b) - (4 * a * c);
        // //console.log("discriminant = " + discriminant);


        // if (discriminant < 0) {
        //     return false;
        // }
        // // (-half_b - Math.sqrt(discriminant)) / (a);

        // ///////////// Пример на с++
        // // vec3 oc = r.origin() - center;
        // // auto a = r.direction().length_squared();
        // // auto half_b = dot(oc, r.direction());
        // // auto c = oc.length_squared() - radius*radius;

        // // auto discriminant = half_b*half_b - a*c;
        // // if (discriminant < 0) return false;
        // // auto sqrtd = sqrt(discriminant);

        // //////////

        // let sqrtd = Math.sqrt(discriminant);
        // //let sqrtd = discriminant * discriminant;
        // let root = ((-half_b) - sqrtd) / a;

        // if (root < t_min || t_max < root) {
        //     root = (-half_b + sqrtd) / a;
        //     if (root < t_min || t_max < root) {
        //         return false;
        //     }
        // }

        // hitRecord.t = root;
        // hitRecord.p = ray.getAt(hitRecord.t);
        // // glMatrix.vec3.normalize(hitRecord.p, hitRecord.p);
        // //hitRecord.normal = (hitRecord.p - this.center) / this.radius;
        // let N = glMatrix.vec3.create();
        // glMatrix.vec3.subtract(N, hitRecord.p, this.center);

        // // glMatrix.vec3.scale(N, hitRecord.p, 1 / this.radius);
        // glMatrix.vec3.normalize(N, N);
        // hitRecord.normal = N;
        // hitRecord.set_face_normal(ray, N);

        // return true;

        // ///////
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
   
        //Геометрическое решение.
    // -------- 1)
    //находим вектор от начала луча до центра сферы
    let oc = glMatrix.vec3.create();
    glMatrix.vec3.subtract(oc, ray.origin, this.center);
    glMatrix.vec3.normalize(ray.direction, ray.direction);

    // -------- 2)
    // Нахидим ближайшую точку на луче относительно центра сферы
    // проекция луча на ОС (расстояние до центра сферы)
    let dot_oc_direction = glMatrix.vec3.dot(oc, ray.direction);

    // -------- 3)
    // Проверяем если скалярное произведение больше чем ноль значить вектор направлен в другую сторону
    if (dot_oc_direction > 0) {
      return false;
    }

    // -------- 4)
    // ишем растояние от ближайшей точки на луче к центру сферы
    let oc_length = glMatrix.vec3.length(oc); // Длина гипотенузы
    //  Квадрата гипотенузы - квадрат прилежашего катета
    let b = Math.sqrt(
      oc_length * oc_length - dot_oc_direction * dot_oc_direction
    );
    // сравниваем растояние до луча с радиусом если меньше чем ноль згначить лучь прошел мимо сферы.
    let t2hc = this.radius - b;
    if (t2hc < 0) {
      return false;
    }

    // -------- 5)
    // получаем ближайшую точку пересечения.
    let a1 = Math.sqrt(this.radius * this.radius - b * b);
    let t1 = dot_oc_direction + a1; // t1 точка пересечения со сферой

    // -------- 6)
    // t1 это множетель на который мы умножаем длину луча
    // поэтому он дожен быть положительным
    hitRecord.t = Math.abs(t1);
    hitRecord.p = ray.getAt(hitRecord.t);

    let N = glMatrix.vec3.create();
    glMatrix.vec3.subtract(N, hitRecord.p, this.center);
    glMatrix.vec3.normalize(N, N);
    hitRecord.normal = N;
    hitRecord.set_face_normal(ray, hitRecord.normal);

    return true;

    }

}