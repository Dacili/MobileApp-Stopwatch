import * as React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Button,
  TouchableOpacity,
  TouchableHighlight,
  ScrollView,
} from 'react-native';
import moment from 'moment';
import Icon from 'react-native-vector-icons/Entypo';

//koristim ga za timer glavni, i za prikaz krugova
function VrijemeMilisekunde({ milisec, stil, boja }) {
  //da uvijek bude format mm:ss:SS a ne m:s:SS
  const fjaDvostrukiBroj = n => {
    return n < 10 ? '0' + n : n;
  };
  var temp = styles.textVrijeme;
  if (stil == 'krug') temp = styles.textKrug;
  var ms = moment.duration(milisec, 'milliseconds');
  return (
    <View
      style={{ flexDirection: 'row', alignSelf: 'stretch', marginLeft: 10 }}>
      <Text style={[temp, { color: boja }]}>
        {fjaDvostrukiBroj(ms.minutes())}:
      </Text>
      <Text style={[temp, { color: boja }]}>
        {fjaDvostrukiBroj(ms.seconds())}:
      </Text>
      <Text style={[temp, { color: boja }]}>
        {fjaDvostrukiBroj(Math.floor(ms.milliseconds() / 10))}
      </Text>
    </View>
  );
}

function OkrugloDugme({
  title,
  bojaDugmeta,
  bojaTeksta,
  onPressHandler,
  disables,
}) {
  const sjena = '5px 3px' + bojaTeksta;
  return (
    <TouchableOpacity onPress={onPressHandler} activeOpacity={0.6}>
      <View
        style={{
          backgroundColor: bojaDugmeta,
          height: 60,
          width: 60,
          borderRadius: 30,
          textAlign: 'center',
          justifyContent: 'center',
          boxShadow: sjena,
        }}>
        <Icon name={title} size={30} color={bojaTeksta} />
      </View>
    </TouchableOpacity>
  );
}

//za krugove popunjavam 1 red
function Odbrojiti({ redniBroj, interval, najbrzi, najsporiji }) {
  var bojaTeksta = 'white';
  if (najbrzi) bojaTeksta = 'green';
  else if (najsporiji) bojaTeksta = '#e60000';
  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 35,
        borderColor: '#333333',
        borderWidth: 0.1,
      }}>
      <Text
        style={{
          flex: 1,
          color: bojaTeksta,
          fontSize: 18,
          fontFamily: 'Georgia',
          padding: 5,
        }}>
        {redniBroj}.
      </Text>
      //reuse
      <VrijemeMilisekunde milisec={interval} stil={'krug'} boja={bojaTeksta} />
    </View>
  );
}

//za krugove popunjavam cijelu tabelu
function TabelaKrugova({ krugovi }) {
  //trazimo min i max tj. najbolje i najgore vrijeme, da ih obojimo u zelenu i crvenu boju
  var min = Number.MAX_SAFE_INTEGER;
  var max = Number.MIN_SAFE_INTEGER;
  if (krugovi.length >= 2) {
    krugovi.forEach(krug => {
      if (min > krug) min = krug;
      if (max < krug) max = krug;
    });
  }

  return (
    <ScrollView
      style={{
        borderColor: 'white',
        marginHorizontal: 50,
        marginBottom: 25,
        borderRadius: 10,
        borderWidth: 1,
      }}>
      {krugovi.map((vrijeme, rB) => (
        <Odbrojiti
          redniBroj={rB + 1}
          interval={vrijeme}
          najbrzi={vrijeme == min}
          najsporiji={vrijeme == max}
          key={rB + 1}
        />
      ))}
    </ScrollView>
  );
}

export default class Stoperica extends React.Component {
  constructor() {
    super();
    this.state = {
      start: 0,
      sada: 0,
      krugovi: [],
      idZaPrekidIntervala: 0, //za obustavu setInterval fje
      pauzaAktivirana: false, //koristim za disable-anje dugmeta stopaj kada se klikne na stop
      zadnjiKrug: 0, //svaki put azuriram, kako bih oduzimala sada- zadnji krug
      stanje: 0,
    };
  }

  dodajMs = () => {
    this.setState({ sada: this.state.sada + 10 });
    this.brojac();
  };
  brojac = () => {
    this.setState({ idZaPrekidIntervala: setTimeout(this.dodajMs, 10) });
  };
  pocni = () => {
    if (this.state.stanje != 0) return;
    this.brojac();
    this.setState({ stanje: 1 });
  };

  stopaj = () => {
    if (this.state.pauzaAktivirana) return;
    var krugoviDodaj = this.state.krugovi;
    krugoviDodaj.push(this.state.sada - this.state.zadnjiKrug);
    this.setState({ zadnjiKrug: this.state.sada });
    this.setState({ krugovi: krugoviDodaj }); //azuriram listu krugova
  };

  pauziraj = () => {
    if (this.state.stanje != 1) return;

    if (this.state.pauzaAktivirana == false) {
      clearTimeout(this.state.idZaPrekidIntervala);
    } else {
      this.brojac();
    }
    this.setState({ pauzaAktivirana: !this.state.pauzaAktivirana });
  };

  ponisti = () => {
    this.setState({
      start: 0,
      sada: 0,
      krugovi: [],
      idZaPrekidIntervala: 0,
      pauzaAktivirana: false,
      zadnjiKrug: 0,
      stanje: 0,
    });
    //moramo prekinuti setInterval fju, inace nastavlja i dalje brojati
    clearInterval(this.state.idZaPrekidIntervala);
  };

  componentWillUnmount() {
    clearInterval(this.state.idZaPrekidIntervala);
  }

  render() {
    const { sada, start, krugovi } = this.state;
    //var vrijeme = sada - start;
    var vrijeme = sada;
    return (
      <View style={{ flex: 1, backgroundColor: 'black', paddingTop: 20 }}>
        <Text
          style={{
            color: 'white',
            textAlign: 'center',
            fontSize: 25,
            fontWeight: 'bold',
            fontFamily: 'Georgia',
          }}>
   {'Stopwatch'} 
        </Text>
        <View style={{ flex: 1, alignItems: 'center', paddingLeft: 5 }}>
          <VrijemeMilisekunde
            milisec={vrijeme}
            stil={'vrijeme'}
            boja={'white'}
          />
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignSelf: 'stretch',
            paddingHorizontal: 15,
          }}>
          <OkrugloDugme
            title="controller-play"
            bojaDugmeta="#009933"
            bojaTeksta="#003300"
            onPressHandler={this.pocni}
          />

          <OkrugloDugme
            title="stopwatch"
            bojaDugmeta="#0077b3"
            bojaTeksta="#002233"
            onPressHandler={this.stopaj}
          />

          <OkrugloDugme
            //title="controller-stop"
            title="controller-paus"
            bojaDugmeta="#ff3333"
            bojaTeksta="#660000"
            onPressHandler={this.pauziraj}
          />

          <OkrugloDugme
            title="ccw"
            bojaDugmeta="#808080"
            bojaTeksta="#333333"
            onPressHandler={this.ponisti}
          />
        </View>

        <View
          style={{
            flex: 2,
            marginTop: 35,
            height: 100,
          }}>
          <TabelaKrugova krugovi={this.state.krugovi} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  textKrug: {
    flex: 3,
    fontSize: 18,
    fontFamily: 'Georgia',
    padding: 3,
    color: 'white',
  },
  textVrijeme: {
    fontSize: 70,
    color: 'white',
    fontWeight: 350,
    fontFamily: 'Georgia',
  },
});
