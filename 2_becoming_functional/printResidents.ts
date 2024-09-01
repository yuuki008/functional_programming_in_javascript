const people = [
  { name: 'Taro', city: 'Fukuoka' },
  { name: 'Jiro', city: 'Tokyo' },
  { name: 'Saburo', city: 'Fukuoka' },
  { name: 'Shiro', city: 'Osaka' },
  { name: 'Goro', city: 'Tokyo' },
];

type Person = {
  name: string;
  city: string;
}


const imperativeProgramming = () => {
  for (let i = 0; i < people.length; i++) {
    if (people[i].city === 'Fukuoka') {
      console.log(people[i]);
    }
  }

  for (let i = 0; i < people.length; i++) {
    if (people[i].city === 'Tokyo') {
      console.log(people[i]);
    }
  }
}

const functinalProgramming = () => {
  const printResidents = (people: Person[], selector: (person: Person) => boolean, printer: (person: Person) => void) => {
    people.filter(selector).forEach((person) => printer(person));
  }

  const inFukuoka = (person: Person) => person.city === 'Fukuoka';
  const inTokyo = (person: Person) => person.city === 'Tokyo';

  printResidents(people, inFukuoka, console.log);
  printResidents(people, inTokyo, console.log);
}
