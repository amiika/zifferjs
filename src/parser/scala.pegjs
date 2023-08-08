
lines = (value / ratio / monzo / operation / sep)+
sep = [' '\t\r\n] { return undefined }
value = float / int / random_int / random_float
random_int = "(" int "," int ")"
random_float = "(" float "," float ")"

float = ("-"? [0-9]* "." [0-9]+ / "." [0-9]+) { return parseFloat(text()) }

int = "-"? [0-9]+ { return parseInt(text()); }

ratio = frac_ratio / edo_ratio / edji_ratio / decimal_ratio
frac_ratio = (int / random_int) "/" (int / random_int)
edo_ratio = (int / random_int) "\\" (int / random_int)
edji_ratio = (int / random_int) "\\" (int / random_int) "<" (int / random_int) "/"? (int / random_int)? ">"
decimal_ratio = int "," int

monzo = "[" int+ ">"
operation = (value / ratio / monzo) (operator ((value / ratio / monzo) / sub_operations / operation))+
operator = "+" / "-" / "*" / "%" / "&" / "|" / "<<" / ">>"
sub_operations = "(" operation ")"