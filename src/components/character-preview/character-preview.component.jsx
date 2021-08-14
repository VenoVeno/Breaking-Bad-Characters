import React from 'react';

import { Properties } from '../../global.properties';

import { ReactComponent as OccupationIcon } from '../../assets/Occupation.svg';
import { ReactComponent as BirthdayIcon } from '../../assets/DOB.svg';
import { ReactComponent as StatusIcon } from '../../assets/Status.svg';
import { ReactComponent as PotrayIcon } from '../../assets/Potray.svg';
import { ReactComponent as SeasonIcon } from '../../assets/Season.svg';

import _isEmpty from 'lodash/isEmpty';

import InfoContainer from '../info-container/info-container.component';

import './character-preview.styles.scss';
import Quotes from '../quotes-display/quotes-display-component';

class CharacterPreview extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            character: {},
            quotes: "",
            message: "Please Hold on! Fetching You the Quotes Said by the Actor!"
        }
    }

    async componentDidMount() {
        let character = null;
        if (this.props.location.state !== undefined)
            character = this.props.location.state.character;

        if (character == null) {
            await fetch(`${Properties.CHARACTER_API}?name=${this.props.match.params.characterName}`, { method: "GET" })
                .then(respone => respone.json())
                .then(responseJSON => {
                    console.log(responseJSON)
                    character = responseJSON[0]
                })
        }

        console.log(character.name)

        fetch(`${Properties.QUOTES_API}?author=${character.name.replaceAll(" ", "+")}`, { method: "GET" })
            .then(respone => respone.json())
            .then(responseJSON => {
                console.log(responseJSON)
                this.setState({
                    quotes: responseJSON,
                    message: responseJSON.length <= 0 ? "Seems No Quotes Are Present!" : ""
                })
            })

        this.setState({
            character
        })
    }

    render() {
        const { character, quotes, message } = this.state
        let occupations = "";

        console.log(character)
        return (
            <div className="collection-preview-container">
                {
                    !_isEmpty(character)
                        ? <div className="character">
                            <div className="image-name-container">
                                <div className="image-container">
                                    <img src={character.img} alt={character.name} />
                                </div>

                                <div className="name-nickname-wrapper">
                                    <div className="name">{character.name}</div>
                                    {
                                        character.nickname
                                            ? <div className="nickname">({character.nickname})</div>
                                            : null
                                    }
                                </div>
                            </div>
                            <div className="details">

                                <InfoContainer Icon={BirthdayIcon} content={character.birthday}
                                    className="birthday" labelContent="Birthday" />

                                {occupations = ""}
                                {
                                    character.occupation.forEach((role, index) => {
                                        occupations = occupations.concat(`${role}${character.occupation.length !== index + 1 ? "," : ""} `);
                                    })
                                }

                                <InfoContainer Icon={OccupationIcon} content={occupations}
                                    className="occupation" labelContent="Occupation" />

                                <InfoContainer Icon={StatusIcon} content={character.status}
                                    className="status" labelContent="Status" />

                                <InfoContainer Icon={PotrayIcon} content={character.portrayed}
                                    className="potrayed" labelContent="Potrayed By" />

                                <InfoContainer Icon={SeasonIcon} content={character.appearance.toString()}
                                    className="season" labelContent="Seasons Acted" />

                                {
                                    !_isEmpty(quotes)
                                        ? quotes.map(quotedata =>
                                            <Quotes className="quotes" content={quotedata.quote} />
                                        )
                                        : <div className="search-error">{message}</div>
                                }
                            </div>
                        </div>
                        : null
                }
            </div>
        )
    }
}

export default CharacterPreview;