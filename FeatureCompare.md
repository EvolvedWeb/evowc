| Feature | React | Evo |
| --- | --- | --- |
| Declarative UI | ✓ | ✓ |
| Component-Based Architecture | ✓ | ✓ |
| One-Way Data Flow (Uni-directional) | ✓ | ✓ |
| Uses native brower events | ✗ | ✓ |
| Conditional and Iteration Directives | JS code in JSX | `$if`, `$switch`, `$for` attributes |
| Simplicity  | ✓ | ✓ |
| Readability | ✓ | ✓ |
| Performance | ✓ | ✓ (*) |
| No constructor | ✓ | ✗ |
| No `this`  | ✓ | ✗ |
| Easy testing | ✓ | ✓ |
| Code reusability | ✓ | ✓ |
| Hot Reloading | ✓ | Not Yet (*) |
| Fragments | ✓ | Not Yet (*) |
| One-way binding | ✓ | ✓ |
| Two-way binding for form elements | ✓ | ✓ |
| Local State | useState | Standard properties (defined as CPAs) |
| Shared State | useContext | Not yet (*)  |
| Application State | Redux | Not yet (*)  |
| Side effects | useEffect | standard and lifecycle methods |
| Redux-like reducer behavior  | useReducer | ✗ |
| Access DOM nodes directly  | useRef | `el="yourName"` attribute and `this.#els.yourName` |
| Memoized version of callback function  | useCallback | Manual (*) |
| Avoids expensive calculations on every render  | useMemo | Manual (*) |
| Expose child methods to parents  | useImperativeHandle | Public Methods |
| perform operations before the browser paints | useLayoutEffect | Public Methods  |
| Display a label for custom hooks in React DevTools  | useDebugValue | None yet (*) |
| Dynamic imports  | ✓ | ✓ |
| Error Boundaries | ✓ | ✗ |
| Concurrent Mode | ✓ | ✗ |
| Strict Mode | ✓ | ✗ |
| Portals | ✓ | ✗ |
| Suspense | ✓ | Conditional Directives  |
| Easy optimization | ✓ | ✓ |
| No lifecycle methods | ✓ | Limited |
| Improved best practices | ✓ | ✓ |
| Extended Developer Tools | ✓ | Not Yet (*) |
| Web standards-based | ✗ | ✓ |
| Framework agnostic | ✗ | ✓ |
| Encapsulation with Shadow DOM | ✗ | ✓ |
| Native performance | ✗ | ✓ |
| Interoperability | ✗ | ✓ |
| Easy adoption and learning curve | ✗ | ✓ |
| Extreamly small runtime dependencies | ✗ | ✓ |
| No virtual DOM diffing | ✗ | ✓ |
| Lightweight and minimalistic | ✗ | ✓ |
| Simplified architecture | ✗ | ✓ |
| Built-in browser compatibility | ✗ | ✓ |
| Enhanced SEO and accessibility | ✗ | ✓ |
| Debug what you write | ✗ | ✓ |
| Setting an elements class name | className={} | :class="" |
| HTML | JSX | Almost Native |
| Routing | ✓ | ✓ |



---

## Evo Example

```html
<component tag="person-profile" :person-id="int" :#person="obj:var:DEFAULT_PERSON">
  <template>
    <div>
      <h1 :text="#person.name"></h1>
      <img :src="#person.image" :alt="#person.name">
      <p :text="#person.statement"></p>
      <div>
        <a :href="#person.facebook" target="_blank" rel="noopener noreferrer">Facebook</a>
        <a :href="#person.youtube" target="_blank" rel="noopener noreferrer">Youtube</a>
        <a :href="#person.instagram" target="_blank" rel="noopener noreferrer">Instagram</a>
      </div>
      <p>Age: <span :text="#person.age"></span></p>
    </div>
  </template>
  <script root>
    const DEFAULT_PERSON = {
      name: 'Loading...',
      image: '',
      statement: '',
      facebook: '',
      youtube: '',
      instagram: '',
      age: 0
    };
  </script>
  <script>
    async #fetchPersonData() {
      const response = await fetch(`https://fakeapi.com/person/${this.personId}`);
      return await response.json();
    }

    async update(key) {
      if (key === 'personId' && this.personId != null) {
        this.#person = await fetchPersonData(this.personId);
      }
    }
  </script>
</component>
```

## React Example

```jsx
import React, { useState, useEffect } from 'react';

const PersonProfile = ({ personId }) => {
  const [personData, setPersonData] = useState({
    name: 'Loading...',
    image: '',
    statement: '',
    social: { facebook: '', youtube: '', instagram: '' },
    age: 0,
  });

  useEffect(() => {
    const fetchPersonData = async () => {
      const response = await fetch(`https://fakeapi.com/person/${personId}`);
      setPersonData(await response.json());
    };

    fetchPersonData();
  }, [personId]);

  return (
    <div>
      <h1>{personData.name}</h1>
      <img src={personData.image} alt={personData.name} />
      <p>{personData.statement}</p>
      <div>
        <a href={personData.social.facebook} target="_blank" rel="noopener noreferrer">Facebook</a>
        <a href={personData.social.youtube} target="_blank" rel="noopener noreferrer">Youtube</a>
        <a href={personData.social.instagram} target="_blank" rel="noopener noreferrer">Instagram</a>
      </div>
      <p>Age: {personData.age}</p>
    </div>
  );
};

export default PersonProfile;
```