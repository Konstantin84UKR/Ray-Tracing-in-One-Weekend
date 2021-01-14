import * as Matrix from './gl-matrix.js';
import Ray from './ray.js';
import hitRecord from './hitRecord.js';
import Sphere from './sphere.js';
import Camera from './camera.js';
import Lambertian from './lambertian.js';
import Metal from './metal.js';
import Dielectric from './dielectric.js';



// Рисуем точку
// получаем контекст, цвет и координаты точки на канвасе 
function point(ctx, color, x, y) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, 1, 1);
}

// случайный вектор в единчной сфере
function ramdom_in_unit_sphere() {
    while (true) {
        let p = glMatrix.vec3.fromValues(Math.random() * 2.0 - 1.0, Math.random(-1, 1), Math.random(-1, 1));

        if (glMatrix.vec3.dot(p, p) >= 1) continue;
        return p;
    }
}
export function ramdom_unit_vector() {
    let p = ramdom_in_unit_sphere();
    glMatrix.vec3.normalize(p, p);
    return p;
}

function ramdom_in_hemisphere(normal) {
    let in_unit_sphere = ramdom_in_unit_sphere();
    if (glMatrix.vec3.dot(in_unit_sphere, normal) > 0.0) {
        return in_unit_sphere;
    } else {
        let in_unit_sphere_negate = glMatrix.vec3.create();
        glMatrix.vec3.negate(in_unit_sphere_negate, in_unit_sphere);
        return in_unit_sphere_negate;
    }
}


function length_squared(e) {
    return e[0] * e[0] + e[1] * e[1] + e[2] * e[2];
}

// в зависимрости от координат красим точку в которую попадает вектор
function ray_color(r, worldObj, depth) {

    if (depth < 0) {
        return glMatrix.vec3.fromValues(0.0, 0.0, 0.0);
    }

    //let colorObj = glMatrix.vec3.fromValues(1.0, 1.0, 1.0);
    let scattered;
    let rec = new hitRecord();
    // Перебираем все обекты в сцене и ищем пересечения с лучем
    for (let index = 0; index < worldObj.length; index++) {
        // const element = worldObj[index];

        let res = glMatrix.vec3.create();
        let bias = 0.001;
        let attenuation = glMatrix.vec3.create();

        let test = glMatrix.vec3.fromValues(0.5, 0.5, 0.5);

        if (worldObj[index].hit(r, bias, Number.MAX_SAFE_INTEGER, rec)) {


            let struct_scatter = rec.matetial.scatter(r, rec, attenuation, scattered);
            // if (rec.matetial.scatter(r, rec, attenuation, scattered)) {
            if (struct_scatter.result) {
                depth = depth - 1;
                let ray_color_temp = ray_color(struct_scatter.scattered, worldObj, depth);
                //glMatrix.vec3.multiply(attenuation, ray_color_temp, test);
                glMatrix.vec3.multiply(attenuation, ray_color_temp, struct_scatter.attenuation);
                //glMatrix.vec3.scale(attenuation, ray_color_temp, 0.5);
                return attenuation;
            }
            return glMatrix.vec3.fromValues(0.0, 0.0, 0.0);
        }

    }

    //---------------  FON -----------------------------//
    let unit_direction = glMatrix.vec3.create();
    glMatrix.vec3.normalize(unit_direction, r.direction);

    let color = glMatrix.vec3.create();
    let t = 1.0 - (0.5 * (unit_direction[1] + 1.0)); // -1  +1  to  0 - 1
    let it = (1.0 - t);
    let vec_one = glMatrix.vec3.fromValues(it * 0.0, it * 0.5, it * 0.9);  // химичис с цветами 
    let vec_two = glMatrix.vec3.fromValues(t * 1.0, t * 1.0, t * 1.0);
    glMatrix.vec3.add(vec_one, vec_one, vec_two);

    return vec_one;

}


function clamp(x, min, max) {
    if (x < min) return min;
    if (x > max) return max;

    return x;
}


function main() {

    let canvas = document.getElementById("RayTracing");
    canvas.width = 800;
    canvas.height = 400;
    let ctx = canvas.getContext('2d');

    let color = 'rgb(0, 0, 0)';
    // point(ctx, color, 10, 50);
    // point(ctx, color, 52, 50);
    // point(ctx, color, 10, 85);
    // point(ctx, color, 10, 59);


    let material_ground = new Lambertian(glMatrix.vec3.fromValues(0.8, 0.4, 0.0));
    let material_center = new Lambertian(glMatrix.vec3.fromValues(0.9, 0.9, 0.9));
    let material_right = new Metal(glMatrix.vec3.fromValues(0.5, 0.5, 0.5), 0.1);
    let material_left = new Dielectric(glMatrix.vec3.fromValues(1.0, 1.0, 1.0), 1.52);

    let sphere1 = new Sphere(glMatrix.vec3.fromValues(0.0, 0.0, .0), 0.5, material_center);
    let sphere2 = new Sphere(glMatrix.vec3.fromValues(1.0, 0.0, .0), 0.5, material_center);
    let sphere3 = new Sphere(glMatrix.vec3.fromValues(-1.0, 0.0, .0), 0.5, material_center);
    let sphere4 = new Sphere(glMatrix.vec3.fromValues(0.0, -1000.5, -1), 1000.0, material_ground);

    let worldObj = [];
    worldObj.push(sphere1);
    worldObj.push(sphere2);
    worldObj.push(sphere3);
    worldObj.push(sphere4);

    const image_width = canvas.width;
    const image_heigth = canvas.height;
    let cam = new Camera(image_width, image_heigth);
    const samples_per_pixel = 40;

    // В цикле проходим все пиксели и вычисляем цвет в зависимости от координат 
    for (let j = 0; j < image_heigth; j += 1) {

        for (let i = 0; i < image_width; i += 1) {

            let color = glMatrix.vec3.create();
            let pixel_color = glMatrix.vec3.create();
            for (let index = 0; index < samples_per_pixel; index++) {

                let u = (((i + Math.random() * 0.5) / image_width) - 0.5) * 2.0 * cam.aspect_ratio;
                let v = (((j + Math.random() * 0.5) / image_heigth) - 0.5) * 2.0 * - 1;

                let r = cam.get_ray(u, v);
                //pixel_color = ray_color(r, worldObj, 50);
                let pixel_color_from_ray = ray_color(r, worldObj, 50);
                glMatrix.vec3.add(pixel_color, pixel_color, pixel_color_from_ray);

            }

            //gamma correction
            let scale = 1 / samples_per_pixel;
            let r = Math.sqrt(pixel_color[0] * scale);
            let g = Math.sqrt(pixel_color[1] * scale);
            let b = Math.sqrt(pixel_color[2] * scale);


            color[0] += Math.floor(255.999 * clamp(r, 0.0, 0.999));
            color[1] += Math.floor(255.999 * clamp(g, 0.0, 0.999));
            color[2] += Math.floor(255.999 * clamp(b, 0.0, 0.999));

            let colorRGB = "rgb(" + color[0] + "," + color[1] + "," + color[2] + ")";
            point(ctx, colorRGB, i, j);
        }
    }
}

main();