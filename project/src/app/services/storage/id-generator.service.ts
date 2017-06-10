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

    public releaseReservedId(...ids: number[]) {
        if (ids && ids.length > 0) {
            console.info(`clearing reserved ids (${ids}) from id regirstry...`);
            this.generatedIDs = this.generatedIDs.filter(currentId =>
                ids.find(id => id === currentId) === -1
            );
            this.storeGeneratedIDs(this.generatedIDs);
            console.info(`Done clearing reserved ids from id regirstry...`);
        }
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