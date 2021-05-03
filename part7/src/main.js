import * as Matrix from './gl-matrix.js';
import Ray from './ray.js';
import hitRecord from './hitRecord.js';
import Sphere from './sphere.js';
import Camera from './camera.js';
import Hittable_list from "./hittable_list.js";


// Рисуем точку
// получаем контекст, цвет и координаты точки на канвасе 
function point(ctx, color, x, y) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, 1, 1);
}

// случайный вектор в единчной сфере
function ramdom_in_unit_sphere() {
    while (true) {
      let p = glMatrix.vec3.fromValues(
        Math.random() * 2.0 - 1.0,
        Math.random() * 2.0 - 1.0,
        Math.random() * 2.0 - 1.0
      );
  
      if (glMatrix.vec3.dot(p, p) >= 1.0) continue;
      return p;
    }
  }

function ramdom_unit_vector() {
    let p = ramdom_in_unit_sphere();
    glMatrix.vec3.normalize(p, p);
    return p;
}

// в зависимрости от координат красим точку в которую попадает вектор
function ray_color(r, worldObj, depth) {

  // если мы дошли до конча глубины преломления то возврашаем черный цвет. 
  // это случаеться в том если луч попал в шель между объектами и так и не вылетел в атмосферу.
  // такому лучу негде брать фотоны  что бы осветить точку.
    if (depth <= 0) {
        return glMatrix.vec3.fromValues(0.0, 0.0, 0.0);
    }
 

    let rec = new hitRecord();
    let colorObj = glMatrix.vec3.fromValues(0.0, 0.0, 0.0);
    // Перебираем все обекты в сцене и ищем пересечения с лучем
      if (worldObj.hit(r,  0.001, Number.MAX_SAFE_INTEGER, rec)) {

            let target = glMatrix.vec3.create();
            let p_plus_n = glMatrix.vec3.create();
            let p_minus_tangent = glMatrix.vec3.create();

            let ramdom_in_unit = ramdom_unit_vector();
            //let ramdom_in_unit = ramdom_in_unit_sphere();
            //
            // Общая идея в том что бы случайным образом переотразить луч от объкта
            // и так до тех пор пока луч не улетит в атмосферу (фон) 
            // или не закончиться глубина переотражения.
            // 
            // При каждом переотражении луч теряет 0.5 от своей силы света,
            // так каждый следуюший луч приносить в половину мешьще света чем превидуший
            // 
            //
            // получаем случайный вектор от отчки каcания в пределах еденичной сферы
            glMatrix.vec3.add(p_plus_n, rec.p, rec.normal);
            glMatrix.vec3.add(target, p_plus_n, ramdom_in_unit);
            glMatrix.vec3.sub(p_minus_tangent, target, rec.p);
            let rayTemp = new Ray(rec.p, p_minus_tangent);
            glMatrix.vec3.scale(colorObj, ray_color(rayTemp, worldObj, depth - 1), 0.5);

            return colorObj;
        }

    //---------------  FON -----------------------------//
    let unit_direction = glMatrix.vec3.create();
    glMatrix.vec3.normalize(unit_direction, r.direction);

    let color = glMatrix.vec3.create();
    let t = 1.0 - (0.5 * (unit_direction[1] + 1.0)); // -1  +1  to  0 - 1
    let it = (1.0 - t);
    let vec_one = glMatrix.vec3.fromValues(it * 0.5, it * 0.7, it * 0.9);  // химичис с цветами 
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

    let sphere1 = new Sphere(glMatrix.vec3.fromValues(0.0, 0, -1.0), 0.5);
    let sphere2 = new Sphere(glMatrix.vec3.fromValues(0.0, -100.5, -1), 100.0);
    
    let worldObj = new Hittable_list();
    worldObj.add(sphere1);
    worldObj.add(sphere2);

    const image_width = canvas.width;
    const image_heigth = canvas.height;
    let cam = new Camera(image_width, image_heigth);
    const samples_per_pixel = 4;

    // В цикле проходим все пиксели и вычисляем цвет в зависимости от координат 
    for (let j = 0; j < image_heigth; j += 1) {

        for (let i = 0; i < image_width; i += 1) {

            let color = glMatrix.vec3.create();
            let pixel_color = glMatrix.vec3.create();
            for (let index = 0; index < samples_per_pixel; index++) {
              
                let u = (((i + Math.random()) / image_width) - 0.5) * 2.0 * cam.aspect_ratio;
                let v = (((j + Math.random()) / image_heigth) - 0.5) * 2.0 * -1;

                let r = cam.get_ray(u, v);
             
                glMatrix.vec3.add(pixel_color, pixel_color, ray_color(r, worldObj, 5));

            }

            // gamma correction
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