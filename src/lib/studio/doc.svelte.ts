
class StudioDoc {
    private doc = $state<any>({});
    private sampleCount = 0;

    get document() {   
        return this.doc;
    }

    setSample() {
        this.doc = {
            sections: [
                {
                    id: 0,
                    name: 'Section 0',
                    type: 'section'
                }
            ]
        }
    }

    addSampleSection() {
        this.sampleCount++;

        this.doc.sections.push({
            id: this.sampleCount,
            name: `Section ${this.sampleCount}`,
            type: 'section'
        });
    }
}

export const studioDoc = new StudioDoc();