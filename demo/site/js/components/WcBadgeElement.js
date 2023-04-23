//************************************************************************************
// Auto generated code for <wc-badge>
// Class: WcBadgeElement
// Generated on: 04/06/2023
//************************************************************************************
import { EvoElement } from '../EvoElement.js';

//************************************************************************************
// Name of this component
const componentName = 'WcBadgeElement';

//************************************************************************************
// Template string
const template = `<slot></slot>`;

//************************************************************************************
// Styles string
const styles = `:host{--bg:#269CE9;--fg:#ffffff;--rad:.35em;align-items:center;background-color:var(--bg);border-radius:var(--rad);color:var(--fg);display:inline-flex;font-size:.75em;justify-content:center;line-height:1;padding:.35em .65em .41em;white-space:nowrap}:host([pill]){--rad:1em}:host([variant="primary"]){--bg:#269CE9}:host([variant="secondary"]){--bg:#6c757d}:host([variant="success"]){--bg:#198754}:host([variant="info"]){--bg:#0dcaf0}:host([variant="warning"]){--bg:#ffc107;--fg:#000000}:host([variant="danger"]){--bg:#dc3545}:host([variant="light"]){--bg:#f8f9fa;--fg:#000000}:host([variant="dark"]){--bg:#212529}`;

//************************************************************************************
// Define class WcBadgeElement for component <wc-badge>
export class WcBadgeElement extends EvoElement() {
  constructor() {
    super();
    this.createDom({componentName,template,styles});
  }
}

// Define the custom element <wc-badge>
customElements.define('wc-badge', WcBadgeElement);
