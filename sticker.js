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
    this.element.style.transform = `translate(calc(${props.x}vw), calc(${props.y}vh))`
    return false
  }

  createElement (props) {
    return html`
      <div class="Board-sticker ${props.saved ? 'is-saved' : ''}" id="sticker-${props.id}" style="transform: translate(calc(${props.x}vw), calc(${props.y}vh))">
        <div class="Sticker"></div>
      </div>
    `
  }
}
