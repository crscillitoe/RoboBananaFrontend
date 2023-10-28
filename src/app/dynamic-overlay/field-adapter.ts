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

        // Hacky color logic, brad's problem later.
        if (currentValue != null && (currentValue as TextField).color != null && (currentValue as TextField).color != undefined && (currentValue as TextField).color != "") {
            if ((newValue as TextField).color == null || (newValue as TextField).color == undefined || (newValue as TextField).color == "") {
                (newValue as TextField).color = (currentValue as TextField).color;
            }
        }

        return newValue ?? currentValue;
    }

    static isMedia(someField?: Field | null): someField is MediaField {
        return someField?.type === FieldType.MEDIA;
    }

    static isText(someField?: Field | null): someField is TextField {
        return someField?.type === FieldType.TEXT;
    }
};