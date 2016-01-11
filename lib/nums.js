var _all_suffixes =
    { short: { '':    1
             ,  K:     1e3
             ,  M:     1e6
             ,  B:     1e9
             ,  T:     1e12
             ,  Qa:    1e15
             ,  Qi:    1e18
             ,  Sx:    1e21
             ,  Sp:    1e24
             ,  Oc:    1e27
             ,  No:    1e30
             ,  De:    1e33
             ,  UnDe:  1e36
             ,  DuDe:  1e39
             ,  TrDe:  1e42
             ,  QaDe:  1e45
             ,  QiDe:  1e48
             ,  SxDe:  1e51
             ,  SpDe:  1e54
             ,  OcDe:  1e57
             ,  NoDe:  1e60
             ,  Vi:    1e63
             ,  UnVi:  1e66
             ,  DuVi:  1e69
             ,  TrVi:  1e72
             ,  QaVi:  1e75
             ,  QiVi:  1e78
             ,  SxVi:  1e81
             ,  SpVi:  1e84
             ,  OcVi:  1e87
             ,  NoVi:  1e90
             ,  Tri:   1e93
             ,  UnTri: 1e96
             ,  DuTri: 1e99
             ,  TrTri: 1e102
             }
    , long: { million:           1e6
            , billion:           1e9
            , trillion:          1e12
            , quadrillion:       1e15
            , quintillion:       1e18
            , sextillion:        1e21
            , septillion:        1e24
            , octillion:         1e27
            , nonillion:         1e30
            , decillion:         1e33
            , undecillion:       1e36
            , duodecillion:      1e39
            , tredecillion:      1e42
            , quattourdecillion: 1e45
            , quindecillion:     1e48
            , sexdecillion:      1e51
            , septendecillion:   1e54
            , octodecillion:     1e57
            , novemdecellion:    1e60
            , vigintillion:      1e63
            , centillion:        1e303
            }
    }
  , _all_seps = { short: ''
                , long: ' '
                }
  ;
var _num_re = /^([\d.]+) ?(\w*)$/
  , _suffixes = _all_suffixes['short']
  , _sep = _all_seps['short']
  ;

function set_style (s) {
  _suffixes = _all_suffixes[s];
  _sep = _all_seps[s];
}

function parse_num (v) {
  var found = _num_re.exec(v);
  return found[1] * _suffixes[found[2]];
}

function abbrev_num (n) {
  var words = n + '';
  for (suff in _suffixes) {
    if (n < _suffixes[suff]) {
      break;
    }

    words = (n/_suffixes[suff]).toFixed(2) + _sep + suff;
  }

  return words;
}


//set_style('long');
var n = 2938402198340*203894012938401920 + 200.33e28
  , ns = abbrev_num(n)
  ;
console.log(n);
console.log(ns);
console.log(parse_num(ns));

