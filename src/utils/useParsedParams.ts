import { useLocalSearchParams } from "expo-router";

type ParamValue=string|string[]|undefined;

const getString=(param:ParamValue):string|undefined => {
    if (!param) return undefined;
    return Array.isArray(param)? param[0]:param
}

const getNumber = (param:ParamValue):number|undefined => {
    const value = getString(param);
    if(!value) return undefined;
    const num = Number(value);
    return isNaN(num)? undefined: num
}

const getDate = (params:ParamValue):Date|null => {
    const value = getString(params);
    if(!value) return null;
    const date = new Date(value);
    return isNaN(date.getTime()) ? null:date
}


const getJSON = <T>(param: ParamValue, fallback: T): T => {
    const value = getString(param);
    if (!value) return fallback;
    try {
        return JSON.parse(value) as T;
    } catch {
        return fallback;
    }
};


export function useParsedParams() {
    const params = useLocalSearchParams();

    return {
        raw: params,
        getString: (key: string) => getString(params[key]),
        getNumber: (key: string) => getNumber(params[key]),
        getDate: (key: string) => getDate(params[key]),
        getJSON: <T>(key: string, fallback: T) =>
            getJSON<T>(params[key], fallback),
    };
}