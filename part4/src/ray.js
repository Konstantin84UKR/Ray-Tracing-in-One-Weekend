
//import { __esModule } from './gl-matrix.js';
//import { sayHi, sayBye } from './say.js';
import * as say from './say.js';

export default class Ray {
    constructor(origin, direction) {
        this.origin = origin;
        this.direction = direction;
        this.t = 1;
    }
    // get origin() {
    //     return this.origin;

    // }
    // get direction() {
    //     return this.direction;
    // }

    getAt(t) {
        //say.sayHi('fgdg');
        //glMatrix.vec3.normalize(this.direction, this.direction);
        let v = glMatrix.vec3.create();
        glMatrix.vec3.scale(v, this.direction, t);
        glMatrix.vec3.add(v, this.origin, v);
        return v;
    }

}