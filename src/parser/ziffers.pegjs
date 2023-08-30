{
  // See imports from zconfig.json
  // imports transform from ziffers.ts
  // imports DEFAULT_DURS from defaults.ts

  var nodeOptions = options.nodeOptions || {};

  function build(ClassReference, values, cont=undefined) {
    values.text = cont ? cont : text();
    values.location = location();
    // Merge all default options to values if value is not set, null or undefined
    for (var key in nodeOptions) {
      if (values[key] === undefined || values[key] === null) {
        values[key] = nodeOptions[key];
      }
    }
    return new ClassReference(values);
  }
  
  // console.log("OPTIONS:", options);
  
}

start = s:statement 
{ 
  return s.filter(a => a);
}

// ----- Numbers -----

float = ("-"? [0-9]* "." [0-9]+ / "." [0-9]+) 
{ return parseFloat(text()) }

int = "-"? [0-9]
{ return parseInt(text()); }

// ------------------ delimiters ---------------------------

ws "whitespace" = [ \n\r\t] 
{ return undefined }

comma = ws "," ws
pipe = ws "|" ws
quote = '"' / "'"


durchar = [mklpdcwyhnqaefsxtgujzo]
{ return DEFAULT_DURS[text()]; }

duration = durchar / float

statement = items

items = n:(repeat / list_operation / list / item / cycle)+
{ return n.filter(a => a) }

list = "(" l:(items) ")"
{ return build(types.List,{items: l}) }

list_operation = a:list b:operation c:list
{ return build(types.ListOperation,{left: a, operation: b, right: c});  }

multi = "-"? [0-9]+
{ return parseInt(text()) }

eval_item = multi / int

eval_items = list:(eval_op / eval_item)+
{ return list.map(val => { return (typeof val === "number") ? val : undefined }); }

eval_op = "("? eval_item operation eval_items ")"?
{ return Math.ceil(safeEval(text())) }

eval = "{" values:(eval_items / ws)+ "}"
{ 
  var pitches = values.filter(a => a).map(val => { return build(types.Pitch, {pitch: val[0]}, val.toString())});
  return build(types.List,{items: pitches});
}

operation = "+" / "-" / "*" / "/" / "%" / "^" / "|" / "&" / ">>" / "<<"

item = v:(rest / chord / pitch / octave_change / ws / duration_change / random / random_between / list / eval / bar)
{ return v }

bar = "|"
{ 
  // Ignore for now
  return undefined 
}

cycle = "<" l:items ">" 
{ return build(types.Cycle,{items: l}) }

octave_change = octave:octave
{ 
  return build(types.OctaveChange,{octave: octave}); 
}

octave = ("^" / "_")+
{ 
  return text().split('').reduce((sum, char) => sum + (char === '^' ? 1 : -1), 0);
}

random = "?"
{ return build(types.RandomPitch,{seededRandom: options.seededRandom}) }

random_between = "(" a:int "," b:int ")"
{ return build(types.RandomPitch,{min: a, max: b, seededRandom: options.seededRandom }) }

repeat = n:item ":" i:int
{ return build(types.Repeat,{item: n, times: i}) }

duration_change = dur:duration 
{ 
  return build(types.DurationChange,{duration: dur}) 
}

rest = d:duration? "r"
{
  return build(types.Rest, {duration: d})
}

pitch = oct:octave? dur:duration? add:accidentals? val:int 
{ 
  const octave = oct ? options.nodeOptions.octave+oct : options.nodeOptions.octave;
  return build(types.Pitch, {duration: dur, pitch: val, octave: octave, add: add})
}

accidentals = acc:("#" / "b")+
{
  return acc.reduce((acc, cur) => { return acc+(cur === "#" ? 1 : -1) },0)
}

chord = left:pitch right:pitch+
{ return build(types.Chord, {pitches:[left].concat(right)}) }

