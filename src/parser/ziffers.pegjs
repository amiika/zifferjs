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

multi = "-"? [0-9]+
{ return parseInt(text()) }

// ------------------ delimiters ---------------------------

ws "whitespace" = [ \n\r\t] 
{ return undefined }

comma = ws "," ws
pipe = ws "|" ws
quote = '"' / "'"

samplename = pitch* [a-z][a-z]+
{
  return build(types.Sample, {sample: text()});
}

durchar = [mklpdcwyhnqaefsxtgujzo]
{ return DEFAULT_DURS[text()]; }

duration = durchar / float

statement = items

items = n:(repeat / list_operation / subdivision / list / replist / item / cycle)+
{ return n.filter(a => a) }

list = "(" ":"? l:(items) rep:(listrepeat)? ")"
{
  if(rep) return build(types.Repeat,{item: l, times: rep});
  else return build(types.List,{items: l}); }

listrepeat = ":" n:multi
{ return n }

list_operation = a:list b:operation c:list
{ return build(types.ListOperation,{left: a, operation: b, right: c});  }

replist = "[:" l:(items) rep:(listrepeat)? "]"
{ return build(types.RepeatList,{items: l, times: rep}) }

subdivision = "[" l:(items) "]"
{ return build(types.Subdivision,{items: l}) }

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

item = v:(rest / romans / namedChord / namedNote / chord / pitch / octave_change / ws / duration_change / random / random_between / list / eval / bar)
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

repeat = n:item ":" i:multi !(")" / "]")
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

chord = oct:octave? left:pitch right:pitch+ inv:(invert)?
{ 
  const octave = oct ? options.nodeOptions.octave+oct : options.nodeOptions.octave;
  return build(types.Chord, {pitches:[left].concat(right), inversion: inv, octave: octave}) 
}

chordName = [a-zA-Z0-9\-\*\+]+
{
  return text()
}

invert = "%" val:multi
{ return val }

noteName = [A-G][bs]?
{
  return text()
}

namedChord = oct:octave? dur:duration? root:(noteName) "^"? name:(chordName) inv:(invert)?
{ 
  const scale = options.nodeOptions.scaleName ? options.nodeOptions.scaleName : "MAJOR";
  const key = options.nodeOptions.key ? options.nodeOptions.key : "C";
  const pitches = getPitchesFromNamedChord(name, root, scale, oct, dur);
  const duration = dur ? dur : options.nodeOptions.duration;
  const octave = oct ? options.nodeOptions.octave+oct : options.nodeOptions.octave;
  return build(types.Chord, {duration: duration, octave: octave, pitches: pitches, chordName: name, inversion: inv, scaleName: scale, key: key})
}

romans = oct:octave? dur:duration? val:("iii" / "ii" / "iv" / "i" / "vii" / "vi" / "v") "^"? name:(chordName)? inv:(invert)?
{
  const scale = options.nodeOptions.scaleName ? options.nodeOptions.scaleName : "MAJOR";
  const key = options.nodeOptions.key ? options.nodeOptions.key : "C";
  const octave = oct ? options.nodeOptions.octave+oct : options.nodeOptions.octave;
  const duration = dur ? dur : options.nodeOptions.duration;
  return build(types.Roman, {duration: duration, roman: val, octave: octave, chordName: name, inversion: inv, scaleName: scale, key: key})
}

namedNote = oct:octave? dur:duration? name:(noteName)
{
  const octave = oct ? options.nodeOptions.octave+oct : options.nodeOptions.octave;
  const scale = options.nodeOptions.scaleName ? options.nodeOptions.scaleName : "MAJOR";
  const key = options.nodeOptions.key ? options.nodeOptions.key : "C";
  const pitch = noteNameToPitchClass(name,key,scale);
  const duration = dur ? dur : options.nodeOptions.duration;
  return build(types.Pitch, {duration: dur, pitch: pitch.pc, octave: pitch.octave + octave, add: pitch.add, scaleName: scale, key: key})
}

