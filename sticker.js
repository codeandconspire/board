const html = require('nanohtml')
const Component = require('nanocomponent')

module.exports = class Sticker extends Component {
  constructor (props) {
    super(props.id)
    this.id = props.id
  }

  update (props) {
    if (props.saved) {
      this.element.classList.add('is-saved')
      return false
    }
    this.element.style.transform = `translate(calc(${props.x}vw - 50%), calc(${props.y}vh - 50%))`
    return false
  }

  createElement (props) {
    return html`
      <div class="Board-sticker ${props.saved ? 'is-saved' : ''}" id="sticker-${props.id}" style="transform: translate(calc(${props.x}vw - 50%), calc(${props.y}vh - 50%))">
        <div class="Sticker"></div>
      </div>
    `
  }
}
