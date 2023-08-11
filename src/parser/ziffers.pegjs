{
  // See imports from zconfig.json
  // imports transform from ziffers.ts
  // imports DEFAULT_DURS from defaults.ts

  var nodeOptions = options.nodeOptions || {};

  function build(ClassReference, values) {
    let instance = new ClassReference(values);
    instance.text = text();
    instance.location = location();
    // Merge all default options to the instance
    for (var key in nodeOptions) {
      if (instance[key] === undefined || instance[key] === null) {
        instance[key] = nodeOptions[key];
      }
    }
  }

  var Node = function(values) { 
    // Merge all values properties to this
    for (var key in values) {
      if(values[key] !== null) {
        this[key] = values[key];
      }
    }
    this.location = location();
    this.text = text();
    if(this.type === 'pitch' || this.type === 'random_pitch') {
      // Merge all default options to the node if value is not set, null or undefined
      for (var key in nodeOptions) {
        if (this[key] === undefined || this[key] === null) {
          this[key] = nodeOptions[key];
        }
      }
      // Transform the node
      transform(this);
    }
  }

  var seed = 0;

   // console.log("OPTIONS:", options);
  
}

start = s:statement 
{ return s.filter(a => a) }

// ----- Numbers -----

float = ("-"? [0-9]* "." [0-9]+ / "." [0-9]+) 
{ return parseFloat(text()) }

int = "-"? [0-9]+ 
{ return parseInt(text()); }

// ------------------ delimiters ---------------------------

ws "whitespace" = [ \n\r\t] 
{ return undefined }

comma = ws "," ws
pipe = ws "|" ws
quote = '"' / "'"


durchar = [a-z] 
{ return DEFAULT_DURS[text()]; }

duration = durchar / float

statement = items

items = n:(repeat / list_operation / list / item / cycle)+
{ return n.filter(a => a) }

list = "(" l:(items) ")"
{ return l.filter(a => a) }

list_operation = a:list b:operation c:list
{ return new Node({type: 'list_operation', left: a, operation: b, right: c});  }

operation = "+" / "-" / "*" / "/" / "%" / "^" / "|" / "&" / ">>" / "<<"

item = v:(chord / pitch / octave_change / ws / duration_change / random / random_between / list)
{ return v }

cycle = "<" l:items ">" 
{ return new Node({type: 'cycle', list: new CycleNode(l)}) }

octave_change = octave:octave
{ 
  options.nodeOptions.octave = octave;
  return new Node({type: 'octave_change', octave: octave}) 
}

octave = ("^" / "_")+
{ 
  return text().split('').reduce((sum, char) => sum + (char === '^' ? 1 : -1), 0);
}

random = "?"
{ return new Node({type: 'random_pitch' }) }

random_between = "(" a:int "," b:int ")"
{ return new Node({type: 'random_pitch', min: a, max: b }) }

repeat = n:item ":" i:int
{ return new Node({type: 'repeat', item: n, times: i}) }

duration_change = dur:duration 
{ 
  options.nodeOptions.duration = dur;
  return new Node({type: 'duration_change', duration: dur}) 
}

pitch = oct:octave? dur:duration? val:int 
{ 
  const octave = oct ? options.nodeOptions.octave+oct : options.nodeOptions.octave
  return new Node({type: 'pitch', duration: dur, pitch: val, octave: octave}) 
}

chord = left:pitch right:pitch+
{ return new Node({type: 'chord', pitches:[left].concat(right)}) }

