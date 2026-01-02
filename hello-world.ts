import {
  attr,
  css,
  customElement,
  FASTElement,
  html,
} from "@microsoft/fast-element";

const styles = css`
  p {
    color: blue;
  }
`;
const template = html`<p>Hello, ${(x) => x.name}!</p>`;

@customElement({ name: "hello-world", styles, template })
export class HelloWorld extends FASTElement {
  @attr accessor name = "World";
}
