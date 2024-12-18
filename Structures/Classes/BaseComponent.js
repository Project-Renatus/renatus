module.exports = class Component {
  constructor(client, option) {
    this.client = client
    this.id = option.id || option.name
    this.options = option.options
  }
  async execute() {
    return await Promise.resolve()
  }
}
