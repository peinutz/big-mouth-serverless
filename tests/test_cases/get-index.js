'use strict'

const expect = require('chai').expect;
const when = require('../steps/when');
const init = require('../steps/init').init;
const cheerio = require('cheerio');

describe("when we invoke GET endpoint", async function() {

    before(async () => {
        await init();
    });

    it("Should return index page with 8 restaurant ", function(done) {
        console.log("test");
        when.we_invoke_get_index().then(res => {
                expect(res.statusCode).to.equal(200);
                expect(res.headers['content-type']).to.equal("text/html; charset=UTF-8");
                expect(res.body).to.not.be.null;

                let $ = cheerio.load(res.body);
                let restaurants = $('.restaurant', '#restaurantsUl');
                expect(restaurants.length).to.equal(8);
                done();

        })
        .catch(err => console.log(err));



    })
});