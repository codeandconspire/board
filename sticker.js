const html = require('nanohtml')
const Component = require('nanocomponent')

module.exports = class Counter extends Component {
  constructor (props) {
    super(props.id)
    this.id = props.id
  }

  update (props) {
    this.element.style.transform = `translate(calc(${props.x}vw - 50%), calc(${props.y}vh - 50%))`
    return false
  }

  createElement (props) {
    return html`
      <div class="Board-sticker" id="sticker-${props.id}" style="transform: translate(calc(${props.x}vw - 50%), calc(${props.y}vh - 50%))">
        <div class="Sticker"></div>
      </div>
    `
  }
}
