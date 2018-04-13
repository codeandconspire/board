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
    this.element.style.transform = `translate(${props.x}vw, ${props.y}vh)`
    return false
  }

  createElement (props) {
    return html`
      <div class="Board-sticker ${props.saved ? 'is-saved' : ''}" id="sticker-${props.id}" style="transform: translate(${props.x}vw, ${props.y}vh)">
        <img class="Sticker" src="${props.image}">
      </div>
    `
  }
}
