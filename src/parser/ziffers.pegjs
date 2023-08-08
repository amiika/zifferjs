{
  var nodeOptions = options.nodeOptions || {};
  var transform = options.transform || function(value) {};
  var DEFAULT_DURATIONS = options.defaultDurs;

  var Node = function(values) { 
    // Merge all values properties to this
    for (var key in values) {
      if(values[key] !== null) {
        this[key] = values[key];
      }
    }
    this.location = location();
    if(this.type === 'pitch') {
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

start = s:statement { return s.filter(a => a) }

// ----- Numbers -----

float = ("-"? [0-9]* "." [0-9]+ / "." [0-9]+) { return parseFloat(text()) }

int = "-"? [0-9]+ { return parseInt(text()); }

// ------------------ delimiters ---------------------------

ws "whitespace" = [ \n\r\t] { return undefined }
comma = ws "," ws
pipe = ws "|" ws
quote = '"' / "'"


durchar = [a-z] { return DEFAULT_DURATIONS[text()]; }

duration = durchar / float

statement = items

items = n:(repeat / list / item)+
{ return n }

list = "(" l:(items) ")"
{ return l.filter(a => a) }

item = v:(chord / pitch / ws / duration_change / list)
{ return v }

repeat = n:item ":" i:int
{ return new Node({type: 'repeat', value: n, times: i}) }

duration_change = dur:duration { 
  options.nodeOptions.duration = dur;
  return new Node({type: 'duration_change', duration: dur}) 
  }

pitch = dur:duration? i:int 
{ return new Node({type: 'pitch', duration: dur, value: i, pitch: parseInt(i)}) }

chord = left:pitch right:pitch+
{ return new Node({type: 'chord', pitches:[left].concat(right)}) }
