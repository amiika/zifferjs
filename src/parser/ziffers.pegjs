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

sound = t:(soundname)
{
  return build(types.Sound, {sound: t});
}

parallelSound = sound ("," sound)*
{ return text() }

soundname = [a-z][a-z_]+[a-z_0-9]*
{ return text() }

sound_param = sound_cycle / sound_items

sound_cycle = "<" l:(sound_param+) ">" 
{ return build(types.Cycle,{items: l}) }

sound_items = soundname / sound_cycle / ws

pitched_sound = "@" v:(sound_param)
{ return v }

containers = list_operation / list / subdivision / cycle / replist

sound_event = e:(containers / item) s:(pitched_sound)
{ return build(types.SoundEvent,{item: e, sound: s}) }

sound_index = e:(sound_event / containers / item) i:(snum)
{ return build(types.SoundIndex,{item: e, soundIndex: i}) }

snum = ":" n:numeric_param
{ return n }

durchar = [mklpdcwyhnqaefsxtgujzo]
{ return DEFAULT_DURS[text()]; }

duration = ratio / float / durchar

ratio = n:multi "/" d:multi
{ return n/d }

statement = items

items = n:(repeat / arpeggio / sound_index / sound_event / list_operation / subdivision / list / replist / item / cycle)+
{ return n.filter(a => a) }

numeric_param = ws / multi / random / random_between / num_cycle / eval_param

num_cycle = "<" l:(numeric_param+) ">" 
{ return build(types.Cycle,{items: l}) }

list = "(" ":"? l:(items) rep:(listrepeat)? ")"
{
  if(rep) return build(types.Repeat,{item: l, times: rep});
  else return build(types.List,{items: l}); 
}

listrepeat = ":" n:multi
{ return n }

list_operation = a:(list / variable) b:operation c:(list / variable / pitch)
{
  if(c instanceof types.Pitch) {
    c = build(types.List, {items:[c]})
  }
  return build(types.ListOperation,{left: a, operation: b, right: c});  
}

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

eval_param = "{" v:(multi / random_between) "}"
{
  return v;
}

operation = "+" / "-" / "*" / "/" / "%" / "^" / "|" / "&" / ">>" / "<<"

item = v:(rest / assignment / romans / namedChord / namedNote / variable / sound / chord / pitch / octave_change / ws / duration_change / list / eval / bar)
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

random_between = "(" a:multi "," b:multi ")"
{ return build(types.RandomPitch,{min: a, max: b, seededRandom: options.seededRandom }) }

repeat = n:(sound_index / sound_event / containers / item) "!" i:multi
{ return build(types.Repeat,{item: n, times: i}) }

duration_change = dur:duration 
{ 
  return build(types.DurationChange,{duration: dur}) 
}

rest_duration = d:duration "^"
{ return d }

rest = d:rest_duration? "r" ![a-zA-Z0-9]
{
  return build(types.Rest, {duration: d})
}

pitch = oct:octave? dur:duration? add:accidentals? val:(int / random / random_between / eval_param)
{
  const octave = oct ? options.nodeOptions.octave+oct : options.nodeOptions.octave;
  return build(types.Pitch, {duration: dur, pitch: val, pitchOctave: octave, add: add})
}

accidentals = acc:("#" / "b")+
{
  return acc.reduce((acc, cur) => { return acc+(cur === "#" ? 1 : -1) },0)
}

arpeggio = c:(chord / namedChord / romans) "@" l:list
{
  return build(types.Arpeggio, {chord: c, indexes: l})
}

chord = left:pitch right:pitch+ inv:(invert)?
{ 
  return build(types.Chord, {pitches:[left].concat(right), inversion: inv}) 
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

assignment = name:([A-Z]) "=" i:(item)
{
  if(!options["variables"]) {
    options["variables"] = {}
  }
  options["variables"][name] = i
  return undefined
}

variable = name:([A-Z])
{
  if(name && options["variables"] && options["variables"][name]) {
    return options["variables"][name]
  } else {
    return undefined
  }
}

namedChord = oct:octave? dur:duration? root:(noteName) "^"? name:(chordName) inv:(invert)?
{ 
  const scale = options.nodeOptions.scaleName ? options.nodeOptions.scaleName : "MAJOR";
  const key = options.nodeOptions.key ? options.nodeOptions.key : "C";
  const pitches = getPitchesFromNamedChord(name, root, scale, oct, dur);
  const duration = dur ? dur : options.nodeOptions.duration;
  const octave = oct ? options.nodeOptions.octave+oct : options.nodeOptions.octave;
  return build(types.Chord, {duration: duration, chordOctave: octave, pitches: pitches, chordName: name, inversion: inv, scaleName: scale, key: key})
}

romans = val:("iii" / "ii" / "iv" / "i" / "vii" / "vi" / "v") "^"? name:(chordName)? inv:(invert)?
{
  const scale = options.nodeOptions.scaleName ? options.nodeOptions.scaleName : "MAJOR";
  const key = options.nodeOptions.key ? options.nodeOptions.key : "C";
  return build(types.Roman, {roman: val, chordName: name, inversion: inv, scaleName: scale, key: key})
}

namedNote = name:(noteName)
{
  // If name is defined as a variable, return the variable
  if(name && options["variables"] && options["variables"][name]) {
    return options["variables"][name]
  }
  const scale = options.nodeOptions.scaleName ? options.nodeOptions.scaleName : "MAJOR";
  const key = options.nodeOptions.key ? options.nodeOptions.key : "C";
  const pitch = noteNameToPitchClass(name,key,scale);
  return build(types.Pitch, {pitch: pitch.pc, add: pitch.add, scaleName: scale, key: key})
}

