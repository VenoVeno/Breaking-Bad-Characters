import React from 'react';

import { Properties } from '../../global.properties';

import { ReactComponent as Logo } from '../../assets/Logo.svg';
import shortid from 'shortid';

import './homepage.styles.scss';

class HomePage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            characterList: [],
            countPerPage: 10,
            pageNumber: 1,
            maxPage: 0,
            searchTerm: ""
        }
    }

    componentDidMount() {
        fetch(Properties.CHARACTER_API, { method: "GET" })
            .then(response => response.json())
            .then(responseJSON => {
                console.log(responseJSON)
                this.setState({
                    characterList: responseJSON,
                    maxPage: (responseJSON.length + 9) / 10
                })
            })
    }

    previousPage = () => {
        if (this.state.pageNumber > 1)
            this.setState({
                pageNumber: this.state.pageNumber - 1
            })
    }

    nextPage = () => {
        if (this.state.pageNumber + 1 <= this.state.maxPage)
            this.setState({
                pageNumber: this.state.pageNumber + 1
            })
    }

    updateSearchKey = (event) => {
        const { value, name } = event.target
        this.setState({
            [name]: value
        })
    }

    render() {
        const { characterList, pageNumber, countPerPage, searchTerm } = this.state;
        let occupations = "";

        console.log("Page Number ", pageNumber)

        console.log(this.props);

        return (
            <div className="home-page-container">
                {/* <div className="header">
                    <div className="image-container">

                    </div>
                    <div className="search-container">
                        <input type="search" name="searchTerm" id="searchTerm"
                            value={searchTerm} onChange={(event) => this.updateSearchKey(event)} />
                    </div>
                </div> */}
                <div className="characters-list">
                    {
                        characterList.length > 0
                            ? characterList
                                .slice((pageNumber * countPerPage) - countPerPage, pageNumber * countPerPage)
                                .filter(character => character.name.includes(searchTerm))
                                .map(character => {
                                    console.log(character.char_id)
                                    return (
                                        <div className="character"
                                            onClick={
                                                () => {
                                                    this.props.history.push(character.name, {
                                                        character
                                                    })
                                                }
                                            }
                                            key={shortid.generate()}
                                        >
                                            <div className="image-wrapper">
                                                <img src={character.img} alt={character.name} />
                                            </div>
                                            <div className="details">
                                                <div className="name">{character.name}</div>
                                                {occupations = ""}
                                                {
                                                    character.occupation.forEach((role, index) => {
                                                        occupations = occupations.concat(`${role}${character.occupation.length !== index + 1 ? "," : ""} `);
                                                    })
                                                }
                                                <div className="occupation">
                                                    {occupations}
                                                </div>
                                                <div className="dob-status-container">
                                                    <div className="birthday">{character.birthday !== "Unknown" ? character.birthday : "DOB Unknown"}</div>
                                                    <div className={`status ${character.status.toLowerCase()}`}>{character.status}</div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            : null
                    }
                </div>
                <div className="pagination">
                    <div className="button previous-page" onClick={() => this.previousPage()}>&laquo; Previous</div>
                    <input type="search" name="searchTerm" id="searchTerm" className="button search-button" placeholder="Search..."
                        value={searchTerm} onChange={(event) => this.updateSearchKey(event)} />
                    <div className="button next-page" onClick={() => this.nextPage()}>Next &raquo;</div>
                </div>
            </div>
        )
    }
}

export default HomePage;