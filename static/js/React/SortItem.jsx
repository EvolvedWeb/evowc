import { useState, useRef, useEffect } from "react";
import "./styles.css";
const enCollator = new Intl.Collator("en");

// cspell:disable
const initialData = [
  { name: "Harry Potter", age: 27, key: 1001 },
  { name: "Hermione Granger", age: 30, key: 1002 },
  { name: "Ron Weasley", age: 31, key: 1003 },
  { name: "Gandalf", age: 2000, key: 1004 },
  { name: "Frodo Baggins", age: 51, key: 1005 },
  { name: "Samwise Gamgee", age: 49, key: 1006 },
  { name: "Bilbo Baggins", age: 111, key: 1007 },
  { name: "Thor", age: 1500, key: 1008 },
  { name: "Loki", age: 1052, key: 1009 },
  { name: "Black Widow", age: 35, key: 1010 },
  { name: "Captain America", age: 100, key: 1011 },
  { name: "Iron Man", age: 47, key: 1012 },
  { name: "The Hulk", age: 50, key: 1013 },
  { name: "Spider-Man", age: 20, key: 1014 },
  { name: "Doctor Strange", age: 42, key: 1015 },
  { name: "Wolverine", age: 137, key: 1016 },
  { name: "Magneto", age: 90, key: 1017 },
  { name: "Professor X", age: 99, key: 1018 } /*,
  { name: "Darth Vader", age: 45, key: 1019 },
  { name: "Luke Skywalker", age: 53, key: 1020 },
  { name: "Princess Leia", age: 56, key: 1021 },
  { name: "Han Solo", age: 65, key: 1022 },
  { name: "Chewbacca", age: 200, key: 1023 },
  { name: "Yoda", age: 900, key: 1024 },
  { name: "Obi-Wan Kenobi", age: 78, key: 1025 },
  { name: "Anakin Skywalker", age: 37, key: 1026 },
  { name: "Qui-Gon Jinn", age: 63, key: 1027 },
  { name: "Padmé Amidala", age: 35, key: 1028 },
  { name: "Mace Windu", age: 53, key: 1029 },
  { name: "Rey", age: 28, key: 1030 },
  { name: "Kylo Ren", age: 33, key: 1031 },
  { name: "Finn", age: 32, key: 1032 },
  { name: "Poe Dameron", age: 36, key: 1033 },
  { name: "C-3PO", age: 112, key: 1034 },
  { name: "R2-D2", age: 60, key: 1035 },
  { name: "BB-8", age: 4, key: 1036 },
  { name: "Winnie the Pooh", age: 90, key: 1037 },
  { name: "Tigger", age: 45, key: 1038 },
  { name: "Mickey Mouse", age: 93, key: 1039 },
  { name: "Donald Duck", age: 86, key: 1040 },
  { name: "Goofy", age: 84, key: 1041 },
  { name: "Snow White", age: 20, key: 1042 },
  { name: "Cinderella", age: 25, key: 1043 },
  { name: "Ariel", age: 28, key: 1044 },
  { name: "Belle", age: 23, key: 1045 },
  { name: "Jasmine", age: 26, key: 1046 },
  { name: "Mulan", age: 30, key: 1047 },
  { name: "Pocahontas", age: 27, key: 1048 },
  { name: "Rapunzel", age: 21, key: 1049 },
  { name: "Tiana", age: 24, key: 1050 },
  { name: "Moana", age: 16, key: 1051 },
  { name: "Buzz Lightyear", age: 25, key: 1052 },
  { name: "Woody", age: 50, key: 1053 },
  { name: "Mr. Incredible", age: 40, key: 1054 },
  { name: "Elastigirl", age: 37, key: 1055 },
  { name: "Violet Parr", age: 14, key: 1056 },
  { name: "Dash Parr", age: 10, key: 1057 },
  { name: "Jack-Jack Parr", age: 2, key: 1058 },
  { name: "Simba", age: 27, key: 1059 },
  { name: "Nala", age: 25, key: 1060 },
  { name: "Timon", age: 19, key: 1061 },
  { name: "Pumbaa", age: 21, key: 1062 },
  { name: "Mufasa", age: 48, key: 1063 },
  { name: "Scar", age: 34, key: 1064 },
  { name: "Zazu", age: 52, key: 1065 },
  { name: "Rafiki", age: 65, key: 1066 },
  { name: "Gru", age: 47, key: 1067 },
  { name: "Agnes", age: 6, key: 1068 },
  { name: "Lucy Wilde", age: 30, key: 1069 },
  { name: "Vector", age: 28, key: 1070 },
  { name: "Minions", age: 2, key: 1071 },
  { name: "Shrek", age: 40, key: 1072 },
  { name: "Donkey", age: 30, key: 1073 },
  { name: "Fiona", age: 38, key: 1074 },
  { name: "Puss in Boots", age: 31, key: 1075 },
  { name: "Gnomeo", age: 30, key: 1076 },
  { name: "Juliet", age: 29, key: 1077 },
  { name: "Sherlock Holmes", age: 47, key: 1078 },
  { name: "Dr. John Watson", age: 50, key: 1079 },
  { name: "Irene Adler", age: 35, key: 1080 },
  { name: "Moriarty", age: 45, key: 1081 },
  { name: "Harry Potter", age: 30, key: 1082 },
  { name: "Ron Weasley", age: 32, key: 1083 },
  { name: "Hermione Granger", age: 31, key: 1084 },
  { name: "Albus Dumbledore", age: 150, key: 1085 },
  { name: "Severus Snape", age: 38, key: 1086 },
  { name: "Voldemort", age: 71, key: 1087 },
  { name: "Gandalf", age: 2019, key: 1088 },
  { name: "Frodo Baggins", age: 51, key: 1089 },
  { name: "Bilbo Baggins", age: 111, key: 1090 },
  { name: "Samwise Gamgee", age: 38, key: 1091 },
  { name: "Gollum", age: 589, key: 1092 },
  { name: "Gandalf the Grey", age: 2019, key: 1093 },
  { name: "Gandalf the White", age: 2019, key: 1094 },
  { name: "Legolas", age: 2931, key: 1095 },
  { name: "Gimli", age: 252, key: 1096 },
  { name: "Aragorn", age: 210, key: 1097 },
  { name: "Boromir", age: 41, key: 1098 },
  { name: "Thorin Oakenshield", age: 195, key: 1099 },
  { name: "Balin", age: 202, key: 1100 }*/
];
// cspell:enable

export default function App() {
  const [sal, setSal] = useState("Mrs");
  const [itemList, setItemList] = useState(initialData);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef(null);

  function saveInputValue(event) {
    setInputValue(event.target.value);
  }
  function doReverse(event) {
    // Reverse the list and update the state
    setItemList(itemList.toReversed());
  }
  function doSort(event) {
    // Sort the list and update the state
    setItemList(
      [...itemList].sort((a, b) => enCollator.compare(a.name, b.name))
    );
  }
  function doAdd(event) {
    const key = itemList.length + 1002;
    console.log({ key });
    // Append a new entry to the list and update the state
    const newItem = {
      name: inputValue,
      age: Math.round(Math.random() * 100),
      key
    };
    setItemList([...itemList, newItem]);
    setInputValue("");
    inputRef.current && inputRef.current.focus();
  }
  function handleClick(evt) {
    console.log({ ...evt.target.dataset });
  }
  function handleClick2(data) {
    console.log(data);
  }

  return (
    <div>
      {itemList.map((item) => (
        <div key={item.key}>
          <span>{sal}</span>
          <button data-key={item.key} onClick={() => handleClick2(item)}>
            {item.name}
          </button>
          <span>{item.age}</span> — <span>{item.name}</span>
          <span>{item.age}</span> - <span>{item.name.toUpperCase()}</span>
          <span>{item.age}</span>
        </div>
      ))}
      <button onClick={doReverse}>Reverse</button>
      <button onClick={doSort}>Sort</button>
      <br />
      <input onChange={saveInputValue} value={inputValue} ref={inputRef}/>
      <button onClick={doAdd}>Add</button>
    </div>
  );
}
