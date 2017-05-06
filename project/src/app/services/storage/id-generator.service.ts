import { Injectable } from '@angular/core';
import { config } from '../../config';

@Injectable()
export class IDGeneratorService {

    private generatedIDs: number[];

    constructor() {
        this.generatedIDs = this.retreiveGeneratedIDs();
    }

    public generateId(): number {
        let newID: number = 0;
        do {
            newID = Math.floor(Math.random() * Math.pow(10, config.guidLength));
        } while (this.generatedIDs.indexOf(newID) != -1);

        this.generatedIDs.push(newID);
        this.storeGeneratedIDs(this.generatedIDs);

        return newID;
    }

    private storeGeneratedIDs(generatedIds: number[]) {
        localStorage.setItem(config.guidCacheKey, JSON.stringify(generatedIds));
    }

    private retreiveGeneratedIDs(): number[] {
        let retreivedArray: number[] = JSON.parse(localStorage.getItem(config.guidCacheKey)) as number[];
        if (retreivedArray == null) {
            retreivedArray = [];
        }
        return retreivedArray
    }
}