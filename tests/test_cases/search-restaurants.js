'use strict'

const expect = require('chai').expect;
const when = require('../steps/when');
const init = require('../steps/init').init;
const cheerio = require('cheerio');
const given = require('../steps/given');
const tearDown = require('../steps/tearDown');

describe("when we invoke GET endpoint", async function() {
    let user;
    before(async () => {
        await init();
        user = await given.an_authenticated_user();
    });

    after(async () => {
        await tearDown.an_authenticated_user(user);
    })

    it("Should return index page with 8 restaurant ", function(done) {
        when.we_invoke_search_restaurants(user, 'cartoon').then(res => {
                expect(res.status).to.equal(200);
                expect(res.data).to.have.lengthOf(4);
                done();
        })
        .catch(err => console.log(err));



    })
});