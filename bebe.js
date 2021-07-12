export default Candidates;

class Baby{
  constructor(name, age, sign, likes, dislikes){
    this.name = name;
    this.age = age;
    this.sign = sign;
    this.likes = likes;
    this.dislikes = dislikes;
  }
}

let Candidates = [];

const Troy = new Baby(
  "Troy Gamil Ulang",
  "21", "Manticore", "Programming, Gaming, ~~Kantu~~ Romance, Maris", "Duterte")
const Nico = new Baby("Nico Aron", "Unknown", "Kwago", "Introspection, Secrets of the Universe, The Great Beyond, Shabu", "Duterte, NPA, Twittertards")
const Czes = new Baby("~~Franch~~ ~~Francs~~ ~~Francze~~ Amythyst", "23", "Latte Venti", "Dogs, Hot guys, Red flags, Sisig, Keneth", "Lahat gusto")
const Mshk = new Baby("Michael Ryan Ojena", "Immortal", "Boysen", "Kush, Weed, Street Life, Mulat sa katotohanan", "Pat")

Candidates.push(Troy);
Candidates.push(Nico);
Candidates.push(Czes);
Candidates.push(Mshk);