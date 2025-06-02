
import { mapValues } from "remeda";



export type Unnullify<T> = T extends Record<string, unknown> ?
    { [K in keyof T]: null extends T[K] ? undefined : Unnullify<T[K]> } :
    T;

export function unnullify<T extends object>(value: T): Unnullify<T> {
    return mapValues(value, (value) => {
        if (value === null) { return undefined; }
        return typeof value === "object" ? unnullify(value) : value;
    }) as Unnullify<T>;
}
