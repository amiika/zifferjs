{
  // See imports from zconfig.json
  // imports transform from ziffers.ts
  // imports DEFAULT_DURS from defaults.ts

  var nodeOptions = options.nodeOptions || {};

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

items = n:(repeat / list_operation / list / item)+
{ return n }

list = "(" l:(items) ")"
{ return l.filter(a => a) }

list_operation = a:list b:operation c:list
{ return new Node({type: 'list_operation', left: a, operation: b, right: c});  }

operation = "+" / "-" / "*" / "/" / "%" / "^" / "|" / "&" / ">>" / "<<"

item = v:(chord / pitch / ws / duration_change / list)
{ return v }

repeat = n:item ":" i:int
{ return new Node({type: 'repeat', value: n, times: i}) }

duration_change = dur:duration 
{ 
  options.nodeOptions.duration = dur;
  return new Node({type: 'duration_change', duration: dur}) 
}

pitch = dur:duration? val:int 
{ return new Node({type: 'pitch', duration: dur, pitch: val}) }

chord = left:pitch right:pitch+
{ return new Node({type: 'chord', pitches:[left].concat(right)}) }

