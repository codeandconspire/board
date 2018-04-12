const html = require('nanohtml')
const Component = require('nanocomponent')

module.exports = class Counter extends Component {
  update (count) {
    return count !== this.count
  }

  createElement (count) {
    this.count = count
    return html`
      <div class="Counter">
        ${count > 0 ? `${count} peeps online` : ''}
      </div>
    `
  }
}
