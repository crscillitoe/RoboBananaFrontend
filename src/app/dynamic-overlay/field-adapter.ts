export enum FieldType {
    TEXT = "text",
    MEDIA = "media"
}
export interface TextField {
    type: FieldType.TEXT;
    value: string;
    color?: string;
}

export interface MediaField {
    type: FieldType.MEDIA;
    source: string;
}

export type Field = TextField | MediaField;

export class FieldAdapter {
    static updateField<T extends Field>(
        currentValue?: T | null,
        newValue?: T | null
    ): T | null | undefined {
        if (newValue === null) return null;
        return newValue ?? currentValue;
    }

    static isMedia(someField?: Field | null): someField is MediaField {
        return someField?.type === FieldType.MEDIA;
    }

    static isText(someField?: Field | null): someField is TextField {
        return someField?.type === FieldType.TEXT;
    }
};