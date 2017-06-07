import { Injectable } from '@angular/core';
import { config } from "../../config";

@Injectable()
export class CloneService {

    public clone(obj: any): any {
        if (obj != null) {
            let clonedObject: any = {};

            let typeString = typeof obj;

            if (typeString === "object") {
                if (obj instanceof Date) {
                    clonedObject = {
                        type: 'date',
                        data: obj
                    }
                } else { // Custom objects and arrays here
                    for (let property in obj) {
                        let propertyType = typeof obj[property];
                        if (propertyType === 'object'
                            && obj[property] != null
                            && obj[property].type !== "date"
                            && obj[property].type !== "reference"
                            && obj[property].type !== "number"
                        ) {

                            if (obj[property] instanceof Array) {
                                clonedObject[property] = [];
                                obj[property].forEach((element: any) => {
                                    clonedObject[property].push(this.parseObject(element));
                                });
                                // clonedObject[property] = this.parseObject(obj[property]);
                            } else if (obj[property] instanceof Date) {
                                // This is an arab solution to replace date values in a special key
                                clonedObject[property] = new Date(obj[property]);
                            } else {
                                clonedObject[property] = this.clone(obj[property]);
                            }
                        } else if (propertyType === 'number') {
                            clonedObject[property] = obj[property]
                        } else {
                            clonedObject[property] = obj[property];
                        }
                    }
                }
            }
            return clonedObject;
        }
    }

    // private parseObject(obj: any) {
    //     if (obj != null) {
    //         let parsedObject: any = {};

    //         let typeString = typeof obj;

    //         if (typeString === "object") {
    //             if (obj instanceof Date) {
    //                 parsedObject = {
    //                     type: 'date',
    //                     data: obj
    //                 }
    //             } else { // Custom objects and arrays here
    //                 for (let property in obj) {
    //                     let propertyType = typeof obj[property];
    //                     if (propertyType === 'object'
    //                         && obj[property] != null
    //                         && obj[property].type !== "date"
    //                         && obj[property].type !== "reference"
    //                         && obj[property].type !== "number"
    //                     ) {

    //                         if (obj[property] instanceof Array) {
    //                             parsedObject[property] = [];
    //                             obj[property].forEach((element: any) => {
    //                                 parsedObject[property].push(this.parseObject(element));
    //                             });
    //                             // clonedObject[property] = this.parseObject(obj[property]);
    //                         } else if (obj[property] instanceof Date) {
    //                             // This is an arab solution to replace date values in a special key
    //                             let newPropertyName = `date_${property}`;
    //                             parsedObject[newPropertyName] = {
    //                                 type: 'date',
    //                                 data: obj[property]
    //                             }
    //                         } else {
    //                             parsedObject[property] = this.parseObject(obj[property]);
    //                         }
    //                     } else if (propertyType === 'number') {
    //                         let newPropertyName = `number_${property}`;
    //                         parsedObject[newPropertyName] = {
    //                             type: 'number',
    //                             data: obj[property]
    //                         }
    //                     } else {
    //                         parsedObject[property] = obj[property];
    //                     }
    //                 }
    //             }
    //         }
    //         return parsedObject;
    //     }
    // }


    public parseObject(obj: any) {
        if (obj != null) {
            let parsedObject: any = {};

            let typeString = typeof obj;

            if (typeString === 'number') {
                parsedObject = {
                    type: 'number',
                    data: obj
                }
            } else if (obj instanceof Date) {
                parsedObject = {
                    type: 'date',
                    data: obj
                }
            } else if (obj instanceof Array) {
                parsedObject = [];
                obj.forEach((element: any) => {
                    parsedObject.push(this.parseObject(element));
                });
            }
            else if (typeString === "object"
                && obj != null
                && obj.type !== "date"
                && obj.type !== "reference"
                && obj.type !== "number") {

                // Custom objects and arrays here
                for (let property in obj) {
                    let propertyType = typeof obj[property];

                    if (obj[property] instanceof Date) {
                        // This is an arab solution to replace date values in a special key
                        let newPropertyName = `date_${property}`;
                        parsedObject[newPropertyName] = this.parseObject(obj[property]);
                    } else if (propertyType === 'number') {
                        let newPropertyName = `number_${property}`;
                        parsedObject[newPropertyName] = this.parseObject(obj[property]);
                    } else {
                        parsedObject[property] = this.parseObject(obj[property]);
                    }
                }
            } else {
                parsedObject = obj;
            }
            return parsedObject;
        }
    }

}
