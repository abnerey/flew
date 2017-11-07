export class FlewMessage extends Error {

    constructor(public body: string, public header: string, public translatable = true) {
        super();
    }

}