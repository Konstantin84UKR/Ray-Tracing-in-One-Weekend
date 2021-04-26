import * as Matrix from './gl-matrix.js';
import Ray from './ray.js';


// Рисуем точку
// получаем контекст, цвет и координаты точки на канвасе 
function point(ctx, color, x, y) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, 1, 1);
}

// единичный вектор
function unit_vector(v) {

    let len2 = v[0] * v[0] + v[1] * v[1] + v[2] * v[2];

    let len = Math.sqrt(len2);
    let d = [];

    d[0] = v[0] / len;
    d[1] = v[1] / len;
    d[2] = v[2] / len;

    return d;
}

// в зависимрости от координат красим точку в которую попадает вектор
function ray_color(r) {
    let centr = glMatrix.vec3.fromValues(0, 0, -1.0);
    if (hit_sphere(centr, 0.5, r) > 0.0) {
        let color2 = [1.0, 0.5, 0.0];
        return color2;
    }

    let unit_direction = glMatrix.vec3.create();
    glMatrix.vec3.normalize(unit_direction, r.direction);

    let color = glMatrix.vec3.create();
    let t = 0.5 * (unit_direction[1] + 1.0); // -1  +1  to  0 - 1
    let it = (1.0 - t);
    let vec_one = glMatrix.vec3.fromValues(it * 0.0, it * 0.5, it * 1.0);  // химичис с цветами 
    let vec_two = glMatrix.vec3.fromValues(t * 1.0, t * 1.0, t * 1.0);
    glMatrix.vec3.add(vec_one, vec_one, vec_two);

    return vec_one;

}

function hit_sphere(center, radius, ray) {

    //Геометрическое решение.
    let oc = glMatrix.vec3.create();
    glMatrix.vec3.subtract(oc, ray.origin, center);
    glMatrix.vec3.normalize(ray.direction, ray.direction);

    let dot_oc_direction = glMatrix.vec3.dot(oc, ray.direction);

    let dot_c_c = glMatrix.vec3.dot(oc, oc);
    let t2hc = radius - Math.sqrt(dot_c_c - dot_oc_direction * dot_oc_direction);

    return t2hc;


    // //////////////////////////////////////////////////////////////
    // // Алгебраическое решение
    // let oc = glMatrix.vec3.create();
    // glMatrix.vec3.subtract(oc, ray.origin, center);

    // let a = glMatrix.vec3.dot(ray.direction, ray.direction);
    // let dot_oc_direction = glMatrix.vec3.dot(oc, ray.direction);
    // let b = 2.0 * dot_oc_direction;

    // let dot_c_c = glMatrix.vec3.dot(oc, oc);
    // let c = dot_c_c - radius * radius;

    // let discriminant = b * b - 4 * a * c;
    // //console.log("discriminant = " + discriminant);

    // return discriminant;
}

function main() {

    let canvas = document.getElementById("RayTracing");
    canvas.width = 800;
    canvas.height = 400;
    let ctx = canvas.getContext('2d');

    let color = 'rgb(200, 0, 0)';
    point(ctx, color, 10, 50);
    point(ctx, color, 52, 50);
    point(ctx, color, 10, 85);
    point(ctx, color, 10, 59);


    const image_width = canvas.width;
    const image_heigth = canvas.height;
    const aspect_ratio = image_width / image_heigth;

    // const viewport_heigth = 2.0;  // высота канваса 
    // const viewport_width = aspect_ratio * viewport_heigth;  // ширинаканваса зависит от отношения сторон
    // const focal_length = 100.0; // дистанция до конца системы координат

    let origin = glMatrix.vec3.fromValues(0, 0, 0.0);

    // В цикле проходим все пиксели и вычисляем цвет в зависимости от координат 
    for (let j = 0; j < image_heigth; j += 1) {

        for (let i = 0; i < image_width; i += 1) {

            let x = ((i / image_width) - 0.5) * 2.0 * aspect_ratio;
            let y = ((j / image_heigth) - 0.5) * 2.0;

            let dir = glMatrix.vec3.fromValues(x, y, -1.0);
            let ray = new Ray(origin, dir);
            let pixel_color = ray_color(ray);

            let ir = Math.floor(255.999 * pixel_color[0]);
            let ig = Math.floor(255.999 * pixel_color[1]);
            let ib = Math.floor(255.999 * pixel_color[2]);

            let color = "rgb(" + ir + "," + ig + "," + ib + ")";
            // let color = 'rgb(200, 0, 0)';
            point(ctx, color, i, j);
        }
    }
}

main();