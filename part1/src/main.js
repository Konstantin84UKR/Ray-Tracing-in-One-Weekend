import * as Matrix from './gl-matrix.js';
import Ray from './ray.js';


// Рисуем точку
// получаем контекст, цвет и координаты точки на канвасе 
function point(ctx, color, x, y) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, 1, 1);
}

// в зависимрости от координат красим точку в которую попадает вектор
function ray_color(r) {

    let unit_direction = glMatrix.vec3.create();
    glMatrix.vec3.normalize(unit_direction, r.direction);

    let t = 0.5 * (unit_direction[1] + 1.0); // Берем Y и вычисляем значение от 0 до +1
    let it = (1.0 - t);
    let vec_one = glMatrix.vec3.fromValues(it * 0.5, it * 0.7, it * 1.0);
    let vec_two = glMatrix.vec3.fromValues(t * 1.0, t * 1.0, t * 1.0);
    glMatrix.vec3.add(vec_one, vec_one, vec_two);

    return vec_one;

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
    let origin = glMatrix.vec3.fromValues(image_width / 2, image_heigth / 2, 0); // ищем центр 

    // В цикле проходим все пиксели и вычисляем цвет в зависимости от координат 
    for (let j = 0; j < image_heigth; j += 1) {

        for (let i = 0; i < image_width; i += 1) {

            let x = ((i / image_width) - 0.5) * 2.0; // от  -1 до  +1
            let y = ((j / image_heigth) - 0.5) * 2.0; // от  -1 до +1

            let dir = glMatrix.vec3.fromValues(x, y, 1.0);
            let ray = new Ray(origin, dir);
            let pixel_color = ray_color(ray);

            let ir = Math.floor(255.999 * pixel_color[0]);
            let ig = Math.floor(255.999 * pixel_color[1]);
            let ib = Math.floor(255.999 * pixel_color[2]);

            let color = "rgb(" + ir + "," + ig + "," + ib + ")"
            // let color = 'rgb(200, 0, 0)';
            point(ctx, color, i, j);
        }
    }
}

main();