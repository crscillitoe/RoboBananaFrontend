export class FieldAdapter {
    static updateField(currentValue: any, newValue?: any) {
        if (newValue === null) return null;
        return newValue ?? currentValue;
    }
}