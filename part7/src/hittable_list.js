// класс сождержит список всех объектов сцены
// --
// метод add добавляет новый объект в сцену
// --
// метод hit проверяет пересечения луча
// со всем объктами сцены и ишет ближайшее пересечение


import hitRecord from './hitRecord.js'

export default class Hittable_list {
    constructor(){
        this.hittable_obj = [];
        this.tempHitRecord = new hitRecord(); 
        // временнные данные по пересечению дальше мы будем 
        // их сверять и искать самое близкое пересечение
    }

  add(o){
    this.hittable_obj.push(o);
  }

  hit(r, tmin, tmax,hitRecord) {
  
  this.tempHitRecord.t = tmax;
  let hitSomething = false;
  let closestT = tmax;

    for (let i = 0, len = this.hittable_obj.length; i < len; i++) {
        if (this.hittable_obj[i].hit(r, tmin, closestT, this.tempHitRecord) > 0.0) {
            if (this.tempHitRecord.t < closestT) {
                hitRecord.t = this.tempHitRecord.t;
                glMatrix.vec3.copy(hitRecord.p, this.tempHitRecord.p);
                glMatrix.vec3.copy(hitRecord.normal, this.tempHitRecord.normal);

                closestT = hitRecord.t;
                hitSomething = true;
            }
        }   
    }
        return hitSomething;
    }

}