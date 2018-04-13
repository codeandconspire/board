const html = require('nanohtml')
const Component = require('nanocomponent')

module.exports = class Counter extends Component {
  constructor (title) {
    super(`counter-${title.split(' ').join('-')}`.toLowerCase())
    this.title = title
  }

  update (count) {
    return count !== this.count
  }

  createElement (count) {
    this.count = count
    return html`
      <div class="Counter">
        ${count > 0 ? `${count} ${this.title}` : ''}
      </div>
    `
  }
}
