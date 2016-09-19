import React from 'react';
import $ from 'jquery';
import _ from 'underscore';
import { withRouter, Link } from 'react-router';
import Deck from './Deck.jsx';
import moment from 'moment';

class Decks extends React.Component {
    constructor() {
        super();

        this.onSelectionChanged = this.onSelectionChanged.bind(this);

        this.state = {
            decks: [],
            error: ''
        };
    }

    componentWillMount() {
        $.ajax({
            url: '/api/decks',
            type: 'GET'
        }).done((data) => {
            if(!data.success) {
                this.setState({ error: data.message });
                return;
            }

            this.setState({ decks: data.decks });

            if(data.decks.length !== 0) {
                this.setState({ selectedDeck: 0 });
            }
        }).fail(() => {
            this.setState({ error: 'Could not communicate with the server.  Please try again later.' });
        });

        $.ajax({
            url: '/api/cards',
            type: 'GET'
        }).done((data) => {
            var agendas = _.filter(data.cards, function(card) {
                return card.type_code === 'agenda' && card.pack_code !== 'VDS';
            });

            this.setState({ cards: data.cards, agendas: agendas });
        });

        $.ajax({
            url: '/api/packs',
            type: 'GET'
        }).done((data) => {
            this.setState({ packs: data.packs });
        });
    }

    onSelectionChanged(newIndex) {
        this.setState({ selectedDeck: newIndex });
    }

    render() {
        var errorBar = this.state.error ? <div className='alert alert-danger' role='alert'>{ this.state.error }</div> : null;
        var decks = [];
        var index = 0;

        _.each(this.state.decks, deck => {
            var className = 'deck-row';
            
            if(index === this.state.selectedDeck) {
                className += ' active';
            }

            decks.push(
                <div className={ className } key={ deck.name } onClick={ this.onSelectionChanged.bind(this, index) }>
                    <img className='pull-left' src={ '/img/factions/' + deck.faction.value + '.png' } />
                    <div>{ deck.name }<span className='pull-right'>Valid?</span></div>
                    <div>{ deck.faction.name } 
                        { deck.agenda && deck.agenda.label ? <span>/{deck.agenda.label}</span> : null }
                        <span className='pull-right'>{ moment(deck.lastUpdated).format('Do MMMM YYYY') }</span>
                    </div>
                </div>
            );

            index++;
        });

        var deckList = (
            <div>
                { decks }
            </div>
        );

        var selectedDeck = undefined;

        if(this.state.selectedDeck !== undefined) {
            selectedDeck = this.state.decks[this.state.selectedDeck];
        }

        return (
            <div>
                { errorBar }
                <div className='col-sm-6'>
                    <Link className='btn btn-primary' to='/decks/add'>Add new deck</Link>
                    <div className='deck-list'>{ this.state.decks.length === 0 ? 'You have no decks, try adding one.' : deckList }</div>
                </div>
                { selectedDeck ? <Deck className='col-sm-6' name={ selectedDeck.name } faction={ selectedDeck.faction } 
                                        plotCards={ selectedDeck.plotCards } drawCards={ selectedDeck.drawCards } agenda={ selectedDeck.agenda }
                                        cards={ this.state.cards } /> 
                               : null }
            </div>);
    }
}

Decks.displayName = 'Decks';
Decks.propTypes = {
    router: React.PropTypes.shape({
        push: React.PropTypes.func.isRequired
    }).isRequired
};

export default withRouter(Decks, { withRef: true });
