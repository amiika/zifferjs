{
    // See imports from sconfig.json
    // import { ratioToCents, monzoToCents } from '../scale';
}

lines = l:(ratio / value / monzo / operation / sep)+ 
{
    return l.filter(a => a).map((item) => {
        // If item is integer it must be ratio
        return Number.isInteger(item) ? ratioToCents(item) : item; 
    });
}

sep = [' '\t\r\n] { return undefined }

value = float / int / random_int / random_float

random_int = "(" min:int "," max:int ")"
{ return Math.floor(Math.random() * (max - min + 1) + min) }

random_float = "(" min:float "," max:float ")"
{ return (Math.random() * (max - min) + min) }

float = ("-"? [0-9]* "." [0-9]+ / "." [0-9]+) { return parseFloat(text()) }

int = "-"? [0-9]+ { return parseInt(text()); }

ratio = edji_ratio / edo_ratio / frac_ratio / decimal_ratio

frac_ratio = a:(int / random_int) "/" b:(int / random_int)
{ return ratioToCents(a/b) }

edo_ratio = a:(int / random_int) "\\" b:(int / random_int)
{ return ratioToCents(Math.pow(2,a/b)) }

edji_ratio = a:(int / random_int) "\\" b:(int / random_int) "<" c:(int / random_int) "/"? d:(int / random_int)? ">"
{ 
    // TODO: Test
    var power = d ? c/d : c 
    return ratioToCents(Math.pow(power, a/b))
}

decimal_ratio = a:int "," b:int
{ return parseFloat(a.toString()+"."+b.toString())}

ints = l:(int / sep)+
{ return l.filter(a => a); }

monzo = "[" l:ints ">"
{ return monzoToCents(l) }

operation = (value / ratio / monzo / sep*) (operator (value / ratio / monzo / sub_operations / operation / sep*))+
{ return eval(text()) }

operator = "+" / "-" / "*" / "%" / "&" / "|" / "<<" / ">>"
sub_operations = "(" operation ")"