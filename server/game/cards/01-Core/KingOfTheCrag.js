const Card = require('../../Card.js');

class KingOfTheCrag extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'opponent',
            match: card => card.hasHouse('brobnar'),
            effect: ability.effects.modifyPower(-2)
        });
    }
}

KingOfTheCrag.id = 'king-of-the-crag'; // This is a guess at what the id might be - please check it!!!

module.exports = KingOfTheCrag;