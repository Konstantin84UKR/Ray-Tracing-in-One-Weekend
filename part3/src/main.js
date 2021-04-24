import * as Matrix from "./gl-matrix.js";
import Ray from "./ray.js";

// Рисуем точку
// получаем контекст, цвет и координаты точки на канвасе
function point(ctx, color, x, y) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, 1, 1);
}

// в зависимрости от координат красим точку в которую попадает вектор
function ray_color(r) {
  let center = glMatrix.vec3.fromValues(0.0, 0.0, -1.0);

  let t = hit_sphere(center, 0.5, r);
  if (t > 0.0) {
    let N = glMatrix.vec3.create();
    //r.t = t;
    N = r.getAt(t); // Точка пересечения

    glMatrix.vec3.subtract(N, N, center); //Вектор от цетра к точке пересечения
    glMatrix.vec3.normalize(N, N); // Приводим нормаль к единичной длине

    let color = [0.0, 0.0, 0.0];
    color[0] = (N[0] + 1) * 0.5;
    color[1] = (N[1] + 1) * 0.5;
    color[2] = (N[2] + 1) * 0.5;
    return color;
  }

  let unit_direction = glMatrix.vec3.create();
  glMatrix.vec3.normalize(unit_direction, r.direction);

  t = 1.0 - 0.5 * (unit_direction[1] + 1.0); // -1  +1  to  0 - 1
  let it = 1.0 - t;
  let vec_one = glMatrix.vec3.fromValues(it * 0.5, it * 0.7, it * 1.0); // химичис с цветами
  let vec_two = glMatrix.vec3.fromValues(t * 1.0, t * 1.0, t * 1.0);
  glMatrix.vec3.add(vec_one, vec_one, vec_two);

  return vec_one;
}

function hit_sphere(center, radius, ray) {
  // // Алгебраическое решение
  //vec3 oc = r.origin() - center;

  // let oc = glMatrix.vec3.create();
  // glMatrix.vec3.subtract(oc, ray.origin, center);

  // let a = glMatrix.vec3.dot(ray.direction, ray.direction);

  // let dot_oc_direction = glMatrix.vec3.dot(oc, ray.direction);
  // let b = 2.0 * dot_oc_direction;

  // let dot_c_c = glMatrix.vec3.dot(oc, oc);
  // let c = dot_c_c - (radius * radius);

  // let discriminant = (b * b) - (4 * a * c);

  // if (discriminant < 0) {
  //     return -1;
  // } else {
  //     return (-b - Math.sqrt(discriminant)) / (2.0 * a);
  // }

  //////////////////////////////////////////////////////////////////////

  //Геометрическое решение.
  // -------- 1)
  //находим вектор от начала луча до центра сферы
  let oc = glMatrix.vec3.create();
  glMatrix.vec3.subtract(oc, ray.origin, center);
  glMatrix.vec3.normalize(ray.direction, ray.direction);

  // -------- 2)
  // Нахидим ближайшую точку на луче относительно центра сферы
  // проекция луча на ОС (расстояние до центра сферы)
  let dot_oc_direction = glMatrix.vec3.dot(oc, ray.direction); 
 
  let dot_c_c = glMatrix.vec3.dot(oc, oc); // квадрат гипотенузы (растояния от начала луча до центра сферы)
  //  Квадрат гипотинузы минус корень от квадрата гипотенузы - квадрат прилежашего катета
  //  это  dot_oc_direction * dot_oc_direction тоже самое что dot_oc_direction во второй степени.
 
  // -------- 3)
  // ишем растояние от ближайшей точки на луче к центру сферы
  let oc_length = glMatrix.vec3.length(oc); // Длина гипотенузы
  //  Квадрата гипотенузы - квадрат прилежашего катета
  let b = Math.sqrt(oc_length * oc_length - dot_oc_direction * dot_oc_direction);
 // сравниваем растояние до луча с радиусом если меньше чем ноль згначить лучь прошел мимо сферы.
  let t2hc = radius - b; 
  if (t2hc < 0) {
    // если ближайшая точка на луче больше чем радиус сферы значить лучь не пересекает сферу
    return -1;
  } else {
    // получаем ближайшую точку пересечения.

    let a1 = Math.sqrt(radius * radius - b * b);
    return -dot_oc_direction - a1;
  }
  
}

function main() {
  let canvas = document.getElementById("RayTracing");
  canvas.width = 400;
  canvas.height = 200;
  let ctx = canvas.getContext("2d");

  let color = "rgb(200, 0, 0)";
  point(ctx, color, 10, 50);
  point(ctx, color, 52, 50);
  point(ctx, color, 10, 85);
  point(ctx, color, 10, 59);

  const image_width = canvas.width;
  const image_heigth = canvas.height;
  const aspect_ratio = image_width / image_heigth;

  let origin = glMatrix.vec3.fromValues(0, 0, 0.0);
  // В цикле проходим все пиксели и вычисляем цвет в зависимости от координат
  for (let j = 0; j < image_heigth; j += 1) {
    for (let i = 0; i < image_width; i += 1) {
      let x = (i / image_width - 0.5) * 2.0 * aspect_ratio;
      let y = (j / image_heigth - 0.5) * 2.0 * -1;

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
