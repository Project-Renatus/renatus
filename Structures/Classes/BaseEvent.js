module.exports = class Event {
  constructor(client, options) {
    this.client = client
    this.name = options.name
    this.ONCE = options.once || false
  }
  async execute() {
    return await Promise.resolve()
  }
}
