import * as Matrix from "./gl-matrix.js";
import Ray from "./ray.js";
import hitRecord from "./hitRecord.js";
import Sphere from "./sphere.js";
import Camera from "./camera.js";
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

  //if (hit(r, 0, Number.MAX_SAFE_INTEGER, rec, worldObj)) {
  if (worldObj.hit(r, 0.0, Number.MAX_SAFE_INTEGER, rec)) {

    let p_plus_n = glMatrix.vec3.create();
    let target = glMatrix.vec3.create();
    let p_minus_tangent = glMatrix.vec3.create();

    let ramdom_in_unit = ramdom_in_unit_sphere(); // получаем случайный вектор от отчки каcания в пределах еденичной сферы
    //
    // Общая идея в том что бы случайным образом переотразить луч от объкта
    // и так до тех пор пока луч не улетит в атмосферу (фон) 
    // или не закончиться глубина переотражения.
    // 
    // При каждом переотражении луч теряет 0.5 от своей силы света,
    // так каждый следуюший луч приносить в половину мешьще света чем превидуший
    // 
    // 
    glMatrix.vec3.add(p_plus_n, rec.p, rec.normal); //-------// переносим нормаль в точку пересечения
    glMatrix.vec3.add(target, p_plus_n, ramdom_in_unit); //--// прибовляем к нормали случайный вектор единичной сферы
    glMatrix.vec3.sub(p_minus_tangent, target, rec.p); //----// получаем направление луча от точки пересечения до случайной точки на единичной сфере
    let rayTemp = new Ray(rec.p, p_minus_tangent); //--------// Создаем новый луч с этим направлением
    let colorTemp = ray_color(rayTemp, worldObj, depth - 1); // рекурсивно переотражаем луч и отнимаем -1 от глубины приломнения
    glMatrix.vec3.scale(colorObj, colorTemp, 0.5);//-------- // при возврате значения сфета мненьшаем силу света в половину для каждого луча.

    return colorObj;
  }

  //---------------  FON -----------------------------//
  let unit_direction = glMatrix.vec3.create();
  glMatrix.vec3.normalize(unit_direction, r.direction);

  let t = 1.0 - 0.5 * (unit_direction[1] + 1.0); // -1  +1  to  0 - 1
  let it = 1.0 - t;
 
  let vec_one = glMatrix.vec3.fromValues(it * 0.5, it * 0.7, it * 0.9); // химичис с цветами
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
  let ctx = canvas.getContext("2d");

  // let color = "rgb(200, 0, 0)";
  // point(ctx, color, 10, 50);
  // point(ctx, color, 52, 50);
  // point(ctx, color, 10, 85);
  // point(ctx, color, 10, 59);

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
  for (let j = 0; j < image_heigth; ++j) {
    for (let i = 0; i < image_width; ++i) {
      let color = glMatrix.vec3.create();
      let pixel_color = glMatrix.vec3.create();
      for (let index = 0; index < samples_per_pixel; ++index) {
       
        let u = ((i + Math.random()) / (image_width - 1) - 0.5) *  2.0 * cam.aspect_ratio;
        let v = ((j + Math.random()) / (image_heigth - 1) - 0.5) * 2.0 * -1;

        let r = cam.get_ray(u, v);
        glMatrix.vec3.add(pixel_color, pixel_color, ray_color(r, worldObj, 5));
      
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
