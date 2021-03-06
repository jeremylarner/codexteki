describe('Ghosthawk', function () {
    describe("Ghostform's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    inPlay: ['troll', 'dew-faerie', 'snufflegator', 'etaromme'],
                    hand: ['ghosthawk']
                },
                player2: {
                    inPlay: ['inka-the-spider', 'seismo-entangler'],
                    hand: ['little-rapscal', 'foggify']
                }
            });

            this.troll.tokens.damage = 4;
        });

        describe('when playing next to two ready creatures', function () {
            beforeEach(function () {
                this.player1.play(this.ghosthawk, true, true);
                this.player1.clickCard(this.dewFaerie);
            });

            it('should be optional', function () {
                this.player1.clickPrompt('Done');
                expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
                expect(this.player1.amber).toBe(0);
            });

            describe('when using the abilty', function () {
                it('should prompt to reap with both cards', function () {
                    expect(this.player1).toBeAbleToSelect(this.troll);
                    expect(this.player1).toBeAbleToSelect(this.dewFaerie);
                    expect(this.player1).not.toBeAbleToSelect(this.snufflegator);
                    expect(this.player1).not.toBeAbleToSelect(this.inkaTheSpider);
                });

                describe('when clicking the left side', function () {
                    beforeEach(function () {
                        this.player1.clickCard(this.troll);
                    });

                    it('should reap with both creatures the card and trigger the reap effect', function () {
                        expect(this.player1.amber).toBe(3);
                        expect(this.troll.tokens.damage).toBe(1);
                        expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
                    });
                });

                describe('when clicking the right side', function () {
                    beforeEach(function () {
                        this.player1.clickCard(this.dewFaerie);
                    });

                    it('should reap with both creatures the card and trigger the reap effect', function () {
                        expect(this.player1.amber).toBe(3);
                        expect(this.troll.tokens.damage).toBe(1);
                        expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
                    });
                });
            });
        });

        describe('when playing next to one ready and one exhausted creature', function () {
            beforeEach(function () {
                this.dewFaerie.exhaust();

                this.player1.play(this.ghosthawk, true, true);
                this.player1.clickCard(this.dewFaerie);
            });

            it('should not prompt to reap with exhausted creatures', function () {
                expect(this.player1).toBeAbleToSelect(this.troll);
                expect(this.player1).not.toBeAbleToSelect(this.dewFaerie);
                expect(this.player1).not.toBeAbleToSelect(this.snufflegator);
                expect(this.player1).not.toBeAbleToSelect(this.inkaTheSpider);
            });

            it('should reap with one creature and trigger the reap effect', function () {
                this.player1.clickCard(this.troll);
                expect(this.player1.amber).toBe(1);
                expect(this.troll.tokens.damage).toBe(1);
                expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            });
        });

        describe('when playing next to one enraged and one stunned ready creatures', function () {
            beforeEach(function () {
                this.troll.stun();
                this.dewFaerie.enrage();

                this.player1.play(this.ghosthawk, true, true);
                this.player1.clickCard(this.dewFaerie);
            });

            it('should allow reaping with enraged creatures', function () {
                expect(this.player1).toBeAbleToSelect(this.troll);
                expect(this.player1).toBeAbleToSelect(this.dewFaerie);
                expect(this.player1).not.toBeAbleToSelect(this.snufflegator);
                expect(this.player1).not.toBeAbleToSelect(this.inkaTheSpider);
            });

            it('should unstun the stunned creatured', function () {
                this.player1.clickCard(this.troll);
                expect(this.player1.amber).toBe(2);
                expect(this.troll.stunned).toBe(false);
                expect(this.dewFaerie.enraged).toBe(true);
                expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            });
        });

        describe('when playing next to enraged creatures and no opponent creature in play', function () {
            beforeEach(function () {
                this.troll.enrage();
                this.dewFaerie.enrage();
                this.player2.moveCard(this.inkaTheSpider, 'discard');

                this.player1.play(this.ghosthawk, true, true);
                this.player1.clickCard(this.dewFaerie);
            });

            it('should reap with both creatures', function () {
                expect(this.player1).toBeAbleToSelect(this.troll);
                expect(this.player1).toBeAbleToSelect(this.dewFaerie);
                expect(this.player1).not.toBeAbleToSelect(this.snufflegator);
                expect(this.player1).not.toBeAbleToSelect(this.inkaTheSpider);
                this.player1.clickCard(this.dewFaerie);
                expect(this.player1.amber).toBe(3);
                expect(this.troll.enraged).toBe(true);
                expect(this.dewFaerie.enraged).toBe(true);
                expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            });
        });

        describe('when playing next to enraged creatures and creatures cannot fight', function () {
            beforeEach(function () {
                this.troll.enrage();
                this.dewFaerie.enrage();
                this.player1.endTurn();
                this.player2.clickPrompt('logos');
                this.player2.play(this.foggify);
                this.player2.endTurn();
                this.player1.clickPrompt('untamed');

                this.player1.play(this.ghosthawk, true, true);
                this.player1.clickCard(this.dewFaerie);
            });

            it('should reap with both creatures', function () {
                expect(this.player1).toBeAbleToSelect(this.troll);
                expect(this.player1).toBeAbleToSelect(this.dewFaerie);
                expect(this.player1).not.toBeAbleToSelect(this.snufflegator);
                expect(this.player1).not.toBeAbleToSelect(this.inkaTheSpider);
                this.player1.clickCard(this.dewFaerie);
                expect(this.player1.amber).toBe(3);
                expect(this.troll.enraged).toBe(true);
                expect(this.dewFaerie.enraged).toBe(true);
                expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            });
        });

        describe('when Little Rapscal is in play', function () {
            beforeEach(function () {
                this.player1.endTurn();
                this.player2.clickPrompt('brobnar');
                this.player2.play(this.littleRapscal);
                this.player2.endTurn();
                this.player1.clickPrompt('untamed');

                this.player1.play(this.ghosthawk, true, true);
                this.player1.clickCard(this.dewFaerie);
            });

            it('should allow reaping with creatures', function () {
                expect(this.player1).toBeAbleToSelect(this.troll);
                expect(this.player1).toBeAbleToSelect(this.dewFaerie);
                expect(this.player1).not.toBeAbleToSelect(this.snufflegator);
                expect(this.player1).not.toBeAbleToSelect(this.inkaTheSpider);
                this.player1.clickCard(this.dewFaerie);
                expect(this.player1.amber).toBe(3);
                expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            });
        });

        describe('when opponent uses Seismo Entangler', function () {
            beforeEach(function () {
                this.player1.endTurn();
                this.player2.clickPrompt('logos');
                this.player2.useAction(this.seismoEntangler);
                this.player2.clickPrompt('untamed');
                this.player2.endTurn();
                this.player1.clickPrompt('untamed');
            });

            describe('and both neighbors are untamed', function () {
                beforeEach(function () {
                    this.player1.play(this.ghosthawk, false, true);
                    this.player1.clickCard(this.dewFaerie);
                });

                it('should not have any prompt to reap', function () {
                    expect(this.player1).not.toBeAbleToSelect(this.troll);
                    expect(this.player1).not.toBeAbleToSelect(this.dewFaerie);
                    expect(this.player1).not.toBeAbleToSelect(this.snufflegator);
                    expect(this.player1).not.toBeAbleToSelect(this.inkaTheSpider);
                    expect(this.player1.amber).toBe(0);
                    expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
                });
            });

            describe('and one neighbor is not untamed', function () {
                beforeEach(function () {
                    this.player1.play(this.ghosthawk, true, true);
                    this.player1.clickCard(this.dewFaerie);
                });

                it('should have a prompt to reap and only non-untamed neighbor is selectable', function () {
                    expect(this.player1).toBeAbleToSelect(this.troll);
                    expect(this.player1).not.toBeAbleToSelect(this.dewFaerie);
                    expect(this.player1).not.toBeAbleToSelect(this.snufflegator);
                    expect(this.player1).not.toBeAbleToSelect(this.inkaTheSpider);
                });

                it('should reap with one creature only and trigger the reap effect', function () {
                    this.player1.clickCard(this.troll);
                    expect(this.player1.amber).toBe(1);
                    expect(this.troll.tokens.damage).toBe(1);
                    expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
                });
            });
        });

        describe('when playing next to Etaromme', function () {
            beforeEach(function () {
                this.player1.play(this.ghosthawk, true, true);
                this.player1.clickCard(this.etaromme);
            });

            it('should prompt to reap with both cards', function () {
                expect(this.player1).toBeAbleToSelect(this.etaromme);
                expect(this.player1).toBeAbleToSelect(this.snufflegator);
                expect(this.player1).not.toBeAbleToSelect(this.troll);
            });

            describe('when selecting etaromme', function () {
                beforeEach(function () {
                    this.player1.clickCard(this.etaromme);
                });

                it('should be prompted for a creature to destroy', function () {
                    expect(this.player1).toBeAbleToSelect(this.dewFaerie);
                    expect(this.player1).toBeAbleToSelect(this.snufflegator);
                    expect(this.player1).toBeAbleToSelect(this.inkaTheSpider);
                    expect(this.player1).toBeAbleToSelect(this.snufflegator);
                });

                it('should be able to destroy Ghosthawk and still reap with its other side creature', function () {
                    this.player1.clickCard(this.ghosthawk);
                    expect(this.player1.amber).toBe(2);
                    expect(this.ghosthawk.location).toBe('discard');
                    expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
                });

                it('should be able to destroy the other neighbor', function () {
                    this.player1.clickCard(this.snufflegator);
                    expect(this.player1.amber).toBe(1);
                    expect(this.snufflegator.location).toBe('discard');
                    expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
                });
            });
        });
    });
});
