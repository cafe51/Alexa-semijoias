export function transformTextInputInNumber(input: string, callBack: (input: number) => void) {
    const value = Number(input);
    value ? callBack(value) : callBack(0);
}