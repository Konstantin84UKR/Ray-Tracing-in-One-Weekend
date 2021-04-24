import * as Matrix from "./gl-matrix.js";
import Ray from "./ray.js";
import hitRecord from "./hitRecord.js";
import Sphere from "./sphere.js";
import Camera from "./camera.js";

let tempHitRecord = new hitRecord();
function hit(r, tmin, tmax, hitRecord, worldObj) {
  var hitSomething = false;
  var closestT = tmax;
  for (var i = 0, len = worldObj.length; i < len; i++) {
    if (worldObj[i].hit(r, tmin, closestT, tempHitRecord) > 0.0) {
      if (tempHitRecord.t < closestT) {
        hitRecord.t = tempHitRecord.t;
        glMatrix.vec3.copy(hitRecord.p, tempHitRecord.p);
        glMatrix.vec3.copy(hitRecord.normal, tempHitRecord.normal);
        // hitRecord.material = tempHitRecord.material;
        closestT = hitRecord.t;
        hitSomething = true;
      }
    }
  }

  return hitSomething;
}

// Рисуем точку
// получаем контекст, цвет и координаты точки на канвасе
function point(ctx, color, x, y) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, 1, 1);
}

// // случайный вектор в единчной сфере
// function ramdom_in_unit_sphere() {
//   while (true) {
//     let p = glMatrix.vec3.fromValues(
//       Math.random(-1, 1),
//       Math.random(-1, 1),
//       Math.random(-1, 1)
//     );

//     if (glMatrix.vec3.dot(p, p) >= 1) continue;
//     return p;
//   }
// }

// случайный вектор в единчной сфере
function ramdom_in_unit_sphere() {
  while (true) {
    let p = glMatrix.vec3.fromValues(
      Math.random() * 2.0 - 1.0,
      Math.random() * 2.0 - 1.0,
      Math.random() * 2.0 - 1.0
    );

    if (glMatrix.vec3.dot(p, p) >= 1.0) continue;
    //glMatrix.vec3.normalize(p, p);
    return p;
  }
}

function length_squared(e) {
  return e[0] * e[0] + e[1] * e[1] + e[2] * e[2];
}

// в зависимрости от координат красим точку в которую попадает вектор
function ray_color(r, worldObj, depth) {
  if (depth <= 0) {
    return glMatrix.vec3.fromValues(0.0, 0.0, 0.0);
  }

  let rec = new hitRecord();
  // Перебираем все обекты в сцене и ищем пересечения с лучем
  //for (let index = 0; index < worldObj.length; index++) {
  // const element = worldObj[index];
  let colorObj = glMatrix.vec3.fromValues(1.0, 1.0, 1.0);
  let res = glMatrix.vec3.create();

  if (hit(r, 0, Number.MAX_SAFE_INTEGER, rec, worldObj)) {
    let target = glMatrix.vec3.create();
    let p_plus_n = glMatrix.vec3.create();
    let p_minus_tangent = glMatrix.vec3.create();

    let ramdom_in_unit = ramdom_in_unit_sphere();
    // получаем случайный вектор от отчки каcания в пределах еденичной сферы
    
    glMatrix.vec3.add(p_plus_n, rec.p, rec.normal);
    glMatrix.vec3.add(target, p_plus_n, ramdom_in_unit);
    glMatrix.vec3.sub(p_minus_tangent, target, rec.p);
    let rayTemp = new Ray(rec.p, p_minus_tangent);
    let colorTemp = ray_color(rayTemp, worldObj, depth - 1);
    glMatrix.vec3.scale(colorObj, colorTemp, 0.5);

    return colorObj;
  }

  //}

  //---------------  FON -----------------------------//
  let unit_direction = glMatrix.vec3.create();
  glMatrix.vec3.normalize(unit_direction, r.direction);

  let color = glMatrix.vec3.create();
  let t = 1.0 - 0.5 * (unit_direction[1] + 1.0); // -1  +1  to  0 - 1
  let it = 1.0 - t;
  //let vec_one = glMatrix.vec3.fromValues(it * 0.0, it * 0.5, it * 0.9); // химичис с цветами
  let vec_one = glMatrix.vec3.fromValues(it * 0.5, it * 0.7, it * 1.0); // химичис с цветами
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
  canvas.width = 400;
  canvas.height = 200;
  let ctx = canvas.getContext("2d");

  let color = "rgb(200, 0, 0)";
  point(ctx, color, 10, 50);
  point(ctx, color, 52, 50);
  point(ctx, color, 10, 85);
  point(ctx, color, 10, 59);

  let sphere1 = new Sphere(glMatrix.vec3.fromValues(0.0, 0, -1.0), 0.5);
  let sphere2 = new Sphere(glMatrix.vec3.fromValues(0.0, -100.5, -1), 100.0);
  let worldObj = [];
  worldObj.push(sphere1);
  worldObj.push(sphere2);

  const image_width = canvas.width;
  const image_heigth = canvas.height;
  let cam = new Camera(image_width, image_heigth);
  const samples_per_pixel = 128;

  // В цикле проходим все пиксели и вычисляем цвет в зависимости от координат
  for (let j = 0; j < image_heigth; ++j) {
    for (let i = 0; i < image_width; ++i) {
      let color = glMatrix.vec3.create();
      let pixel_color = glMatrix.vec3.create();
      for (let index = 0; index < samples_per_pixel; ++index) {
       
        let u = ((i + Math.random()) / (image_width - 1) - 0.5) *  2.0 * cam.aspect_ratio;
        let v = ((j + Math.random()) / (image_heigth - 1) - 0.5) * 2.0 * -1;

        let r = cam.get_ray(u, v);
        //pixel_color = ray_color(r, worldObj, 50);

        glMatrix.vec3.add(pixel_color, pixel_color, ray_color(r, worldObj, 15));

        // color[0] += Math.floor(255.999 * clamp(pixel_color[0], 0.0, 0.999));
        // color[1] += Math.floor(255.999 * clamp(pixel_color[1], 0.0, 0.999));
        // color[2] += Math.floor(255.999 * clamp(pixel_color[2], 0.0, 0.999));
      }

      color[0] += Math.floor(255.999 * clamp(pixel_color[0] / samples_per_pixel, 0.0, 0.999));
      color[1] += Math.floor(255.999 * clamp(pixel_color[1] / samples_per_pixel, 0.0, 0.999));
      color[2] += Math.floor(255.999 * clamp(pixel_color[2] / samples_per_pixel, 0.0, 0.999));

      let colorRGB = "rgb(" + color[0] + "," + color[1] + "," + color[2] + ")";
      point(ctx, colorRGB, i, j);
    }
  }
}

main();
