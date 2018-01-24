import {FlewMessageDefinition} from "./flew.types";

export class FlewMessage extends Error {

    body: string;
    header: string;
    translatable: boolean;
    congruent: string;

    constructor(definition: FlewMessageDefinition) {
        super();
        const {body, header, translatable = true, congruent} = definition;
        this.congruent = congruent;
        this.body = congruent || body;
        this.header = congruent || header;
        this.translatable = translatable;
    }

}
