export function stringRewrite(axiom: string, rules: Record<string|number, string | number | ((...args: any[]) => string|number)>): string {
    const keys = Object.keys(rules).reverse();
    function applyRules(match: string): string {
        for (const key of keys) {
            const value = rules[key];
            const regex = new RegExp(key);
            if (regex.test(match)) {
                if (typeof value === 'function') {
                    let matches = match.match(regex) as string[];
                    if(matches.length>1) matches = matches.slice(1);
                    const parsed = matches.map((v) => isNaN(parseInt(v)) ? v : parseInt(v));
                    return value(...parsed).toString();
                }
                return value.toString();
            }
        }
        return match[0];
    }
    const pattern = new RegExp(keys.join('|'), 'g');
    return axiom.replace(pattern, (match) => applyRules(match));
}

/*
* Lindenmayer / L-System inspired rule-based string rewrite system using regular expressions and lambdas
* @param axiom - initial string
* @param rules - object of rules
* @param generations - number of iterations
* @example rsystem("0 1 2", {"[0-9]*": (a)=>a+a+2}, 2) // Outputs: 462 862 1262
* @returns string
*/

export function rsystem(axiom: string, rules: Record<string|number, string | number | ((...args: any[]) => string|number)>, iterations: number): string {
    let result = axiom;
    for (let i = 0; i < iterations; i++) {
        result = stringRewrite(result, rules);
    }
    return result;
}