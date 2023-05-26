//************************************************************************************
// Auto generated code for <wc-loop>
// Class: WcLoopElement
// Generated on: 05/06/2023
//************************************************************************************
import { EvoElement, setAttr, ael } from '../EvoElement.js';
const enCollator = new Intl.Collator('en');

//************************************************************************************
// Name of this component
const componentName = 'WcLoopElement';

//************************************************************************************
// Template string
const template = `<div class=main>
<h2>Testing For Loops</h2>
<div js=el999 _loop=el999 _item=item.key>
  <span js=el0></span>
  <button js=el1></button>
  <span js=el2></span> &mdash;
  <span js=el5></span>
  <span js=el6></span> -
  <span js=el7></span>
  <span js=el8></span>
</div>
<button js=el3>Reverse</button>
<button js=el4>Sort</button>
<button js=el44>Add</button>
</div>`;

//************************************************************************************
// Styles string
const styles = `:host{display:block;height:fit-content}.main{border:1px solid #000;padding:10px;background:#DDD;margin:10px 10px}`;

//************************************************************************************
// Define class WcLoopElement for component <wc-loop>
export class WcLoopElement extends EvoElement() {
  #els = {};
  #things;
  #title;

  //**********************************************************************************
  // Return the list of attributes this component is watching
  static get observedAttributes() {
    return ['things', 'title'];
  }

  constructor() {
    super();
    this.#els = this.createDom({ componentName, template, styles });

    // Initialize with default values
    this.things ??= [];
    this.title ??= '';

    // Event handlers
    ael(this.#els.el3, 'click', (evt) => this.#reverse(evt, { ...evt.target.dataset }));
    ael(this.#els.el4, 'click', (evt) => this.#sort(evt, { ...evt.target.dataset }));
    ael(this.#els.el44, 'click', (evt) => this.#add(evt, { ...evt.target.dataset }));

    // If your class has an init function then we call it.
    if (this.init) {
      this.init();
    }
  }

  //**********************************************************************************
  // This is called when any property is updated
  #callUpdate(field, oldVal, newVal) {
    this.isConnected && this.update && this.update(field, oldVal, newVal);
  }

  //**********************************************************************************
  // Properties
  get things() {
    return this.#things;
  }
  set things(newVal) {
    const before = window.performance.now();
    newVal = (typeof newVal === 'string' ? JSON.parse(newVal) : newVal);
    const oldVal = this.#things;
    this.#things = newVal;
    this.forLoop('el999', newVal, 'key', (els, item, events) => {
      // fill in attributes and properties
      els.el0.textContent = this.title;
      els.el1.textContent = item.name;
      els.el1.dataset.key = item.key;
      els.el2.textContent = item.age;
      els.el5.textContent = item.name;
      els.el5.dataset.key = item.key;
      els.el6.textContent = item.age;
      els.el7.textContent = item.name;
      els.el7.dataset.key = item.key;
      els.el8.textContent = item.age;

      // add event handlers
      events.push(ael(els.el1, 'click', (evt) => this.#clickItem(evt, { ...evt.target.dataset })));
      setAttr(els.el999, 'key', item.key);
    });
    this.#callUpdate('things', oldVal, newVal);
    const after = window.performance.now();
    console.log(`things time: ${after - before}ms`);
  }


  get title() {
    return this.#title;
  }
  set title(newVal) {
    const before = window.performance.now();
    newVal = newVal == null ? null : '' + newVal;
    if (newVal !== this.#title) {
      const oldVal = this.#title;
      this.#title = newVal;
      this.allEls('el0').forEach(el => el.textContent = newVal);
      this.#callUpdate('title', oldVal, newVal);
    }
    const after = window.performance.now();
    console.log(`Title time: ${after - before}ms`);
  }

  //**********************************************************************************
  // Start of your code
  init() {
    this.things = [
      { name: 'Harry Potter', age: 27, key: 1 },
      { name: 'Hermione Granger', age: 30, key: 2 },
      { name: 'Ron Weasley', age: 31, key: 3 },
      { name: 'Gandalf', age: 2000, key: 4 },
      { name: 'Frodo Baggins', age: 51, key: 5 }/*,
      { name: 'Samwise Gamgee', age: 49, key: 6 },
      { name: 'Bilbo Baggins', age: 111, key: 7 },
      { name: 'Thor', age: 1500, key: 8 },
      { name: 'Loki', age: 1052, key: 9 },
      { name: 'Black Widow', age: 35, key: 10 },
      { name: 'Captain America', age: 100, key: 11 },
      { name: 'Iron Man', age: 47, key: 12 },
      { name: 'The Hulk', age: 50, key: 13 },
      { name: 'Spider-Man', age: 20, key: 14 },
      { name: 'Doctor Strange', age: 42, key: 15 },
      { name: 'Wolverine', age: 137, key: 16 },
      { name: 'Magneto', age: 90, key: 17 },
      { name: 'Professor X', age: 99, key: 18 },
      { name: 'Darth Vader', age: 45, key: 19 },
      { name: 'Luke Skywalker', age: 53, key: 20 },
      { name: 'Princess Leia', age: 56, key: 21 },
      { name: 'Han Solo', age: 65, key: 22 },
      { name: 'Chewbacca', age: 200, key: 23 },
      { name: 'Yoda', age: 900, key: 24 },
      { name: 'Obi-Wan Kenobi', age: 78, key: 25 },
      { name: 'Anakin Skywalker', age: 37, key: 26 },
      { name: 'Qui-Gon Jinn', age: 63, key: 27 },
      { name: 'Padmé Amidala', age: 35, key: 28 },
      { name: 'Mace Windu', age: 53, key: 29 },
      { name: 'Rey', age: 28, key: 30 },
      { name: 'Kylo Ren', age: 33, key: 31 },
      { name: 'Finn', age: 32, key: 32 },
      { name: 'Poe Dameron', age: 36, key: 33 },
      { name: 'C-3PO', age: 112, key: 34 },
      { name: 'R2-D2', age: 60, key: 35 },
      { name: 'BB-8', age: 4, key: 36 },
      { name: 'Winnie the Pooh', age: 90, key: 37 },
      { name: 'Tigger', age: 45, key: 38 },
      { name: 'Mickey Mouse', age: 93, key: 39 },
      { name: 'Donald Duck', age: 86, key: 40 },
      { name: 'Goofy', age: 84, key: 41 },
      { name: 'Snow White', age: 20, key: 42 },
      { name: 'Cinderella', age: 25, key: 43 },
      { name: 'Ariel', age: 28, key: 44 },
      { name: 'Belle', age: 23, key: 45 },
      { name: 'Jasmine', age: 26, key: 46 },
      { name: 'Mulan', age: 30, key: 47 },
      { name: 'Pocahontas', age: 27, key: 48 },
      { name: 'Rapunzel', age: 21, key: 49 },
      { name: 'Tiana', age: 24, key: 50 },
      { name: 'Moana', age: 16, key: 51 },
      { name: 'Buzz Lightyear', age: 25, key: 52 },
      { name: 'Woody', age: 50, key: 53 },
      { name: 'Mr. Incredible', age: 40, key: 54 },
      { name: 'Elastigirl', age: 37, key: 55 },
      { name: 'Violet Parr', age: 14, key: 56 },
      { name: 'Dash Parr', age: 10, key: 57 },
      { name: 'Jack-Jack Parr', age: 2, key: 58 },
      { name: 'Simba', age: 27, key: 59 },
      { name: 'Nala', age: 25, key: 60 },
      { name: 'Timon', age: 19, key: 61 },
      { name: 'Pumbaa', age: 21, key: 62 },
      { name: 'Mufasa', age: 48, key: 63 },
      { name: 'Scar', age: 34, key: 64 },
      { name: 'Zazu', age: 52, key: 65 },
      { name: 'Rafiki', age: 65, key: 66 },
      { name: 'Gru', age: 47, key: 67 },
      { name: 'Agnes', age: 6, key: 68 },
      { name: 'Lucy Wilde', age: 30, key: 69 },
      { name: 'Vector', age: 28, key: 70 },
      { name: 'Minions', age: 2, key: 71 },
      { name: 'Shrek', age: 40, key: 72 },
      { name: 'Donkey', age: 30, key: 73 },
      { name: 'Fiona', age: 38, key: 74 },
      { name: 'Puss in Boots', age: 31, key: 75 },
      { name: 'Gnomeo', age: 30, key: 76 },
      { name: 'Juliet', age: 29, key: 77 },
      { name: 'Sherlock Holmes', age: 47, key: 78 },
      { name: 'Dr. John Watson', age: 50, key: 79 },
      { name: 'Irene Adler', age: 35, key: 80 },
      { name: 'Moriarty', age: 45, key: 81 },
      { name: 'Harry Potter', age: 30, key: 82 },
      { name: 'Ron Weasley', age: 32, key: 83 },
      { name: 'Hermione Granger', age: 31, key: 84 },
      { name: 'Albus Dumbledore', age: 150, key: 85 },
      { name: 'Severus Snape', age: 38, key: 86 },
      { name: 'Voldemort', age: 71, key: 87 },
      { name: 'Gandalf', age: 2019, key: 88 },
      { name: 'Frodo Baggins', age: 51, key: 89 },
      { name: 'Bilbo Baggins', age: 111, key: 90 },
      { name: 'Samwise Gamgee', age: 38, key: 91 },
      { name: 'Gollum', age: 589, key: 92 },
      { name: 'Gandalf the Grey', age: 2019, key: 93 },
      { name: 'Gandalf the White', age: 2019, key: 94 },
      { name: 'Legolas', age: 2931, key: 95 },
      { name: 'Gimli', age: 252, key: 96 },
      { name: 'Aragorn', age: 210, key: 97 },
      { name: 'Boromir', age: 41, key: 98 },
      { name: 'Thorin Oakenshield', age: 195, key: 99 },
      { name: 'Balin', age: 202, key: 100 }*/
    ];
  }
  #clickItem(event, data) {
    console.log(data);
  }
  #reverse(event, data) {
    this.things = this.things.reverse();
  }
  #sort(event, data) {
    this.things = [...this.things].sort((a, b) => enCollator.compare(a.name, b.name));
  }
  #getName() {
    let name = '';
    const len = 5 + Math.round(Math.random() * 10);
    for(let i = 0; i < len; i++) {
      name += String.fromCharCode(65 + Math.round(Math.random() * 26));
    }

    return name;
  }
  #add(event, data) {
    const newItem = { name: this.#getName(), age: Math.round(Math.random()*100), key: this.#things.length+1 }
    this.things = [...this.things, newItem];
  }
  // End of your code
  //**********************************************************************************
}

// Define the custom element <wc-loop>
customElements.define('wc-loop', WcLoopElement);
