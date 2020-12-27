import * as Matrix from './gl-matrix.js';
import Ray from './ray.js';
import hitRecord from './hitRecord.js';
import Sphere from './sphere.js';
import Camera from './camera.js';


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
function ray_color(r, worldObj) {

    let colorObj = glMatrix.vec3.fromValues(1.0, 1.0, 1.0);

    let rec = new hitRecord();
    // Перебираем все обекты в сцене и ищем пересечения с лучем
    for (let index = 0; index < worldObj.length; index++) {
        const element = worldObj[index];

        if (element.hit(r, 0, Number.MAX_SAFE_INTEGER, rec)) {

            let res = glMatrix.vec3.create();

            res[0] = (rec.normal[0] + colorObj[0]) * 0.5;
            res[1] = (rec.normal[1] + colorObj[1]) * 0.5;
            res[2] = (rec.normal[2] + colorObj[2]) * 0.5;

            return res;
        }
    }

    //---------------  FON -----------------------------//
    let unit_direction = glMatrix.vec3.create();
    glMatrix.vec3.normalize(unit_direction, r.direction);

    let color = glMatrix.vec3.create();
    let t = 1.0 - (0.5 * (unit_direction[1] + 1.0)); // -1  +1  to  0 - 1
    let it = (1.0 - t);
    let vec_one = glMatrix.vec3.fromValues(it * 0.0, it * 0.5, it * 1.0);  // химичис с цветами 
    let vec_two = glMatrix.vec3.fromValues(t * 1.0, t * 1.0, t * 1.0);
    glMatrix.vec3.add(vec_one, vec_one, vec_two);

    return vec_one;

}


function clamp(x, min, max) {
    if (x < min) return min;
    if (x > max) return max;

    return x;
}

function hit_sphere(center, radius, ray) {
    //vec3 oc = r.origin() - center;

    let oc = glMatrix.vec3.create();
    glMatrix.vec3.subtract(oc, ray.origin, center);

    let a = glMatrix.vec3.dot(ray.direction, ray.direction);

    let dot_oc_direction = glMatrix.vec3.dot(oc, ray.direction);
    let b = 2.0 * dot_oc_direction;
    let half_b = dot_oc_direction;

    let dot_c_c = glMatrix.vec3.dot(oc, oc);
    let c = dot_c_c - (radius * radius);

    let discriminant = (half_b * half_b) - (a * c);
    //console.log("discriminant = " + discriminant);


    if (discriminant < 0) {
        return -1;
    } else {
        return (-half_b - Math.sqrt(discriminant)) / (a);
    }



}

function main() {

    let canvas = document.getElementById("RayTracing");
    canvas.width = 400;
    canvas.height = 200;
    let ctx = canvas.getContext('2d');

    let color = 'rgb(200, 0, 0)';
    point(ctx, color, 10, 50);
    point(ctx, color, 52, 50);
    point(ctx, color, 10, 85);
    point(ctx, color, 10, 59);


    let sphere1 = new Sphere(glMatrix.vec3.fromValues(0, 0, -1.0), 0.5);
    let sphere2 = new Sphere(glMatrix.vec3.fromValues(0.0, -100.5, -1), 100.0);
    let worldObj = [];
    worldObj.push(sphere1);
    worldObj.push(sphere2);

    const image_width = canvas.width;
    const image_heigth = canvas.height;
    let cam = new Camera(image_width, image_heigth);

    // В цикле проходим все пиксели и вычисляем цвет в зависимости от координат 
    for (let j = 0; j < image_heigth; j += 1) {

        for (let i = 0; i < image_width; i += 1) {

            let color = glMatrix.vec3.create();
            for (let index = 0; index < 4; index++) {

                let u = (((i + Math.random() * 0.5) / image_width) - 0.5) * 2.0 * cam.aspect_ratio;
                let v = (((j + Math.random() * 0.5) / image_heigth) - 0.5) * 2.0 * - 1;

                let r = cam.get_ray(u, v);
                let pixel_color = ray_color(r, worldObj);

                color[0] += Math.floor(255.999 * clamp(pixel_color[0] / 4, 0.0, 0.999));
                color[1] += Math.floor(255.999 * clamp(pixel_color[1] / 4, 0.0, 0.999));
                color[2] += Math.floor(255.999 * clamp(pixel_color[2] / 4, 0.0, 0.999));

            }

            let colorRGB = "rgb(" + color[0] + "," + color[1] + "," + color[2] + ")";
            point(ctx, colorRGB, i, j);
        }
    }
}

main();