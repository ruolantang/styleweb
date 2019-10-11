const knex = require('knex')(require('./knexfile'))

module.exports = {
    imgList () {
        return knex('styleImg').select('*')
    }
}