import React from 'react';

import { Properties } from '../../global.properties';

import shortid from 'shortid';

import './homepage.styles.scss';

class HomePage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            characterList: [],
            filteredCharacterList: [],
            countPerPage: 10,
            pageNumber: 1,
            maxPage: 0,
            searchTerm: "",
            message: "Please Hold on! Getting You The Favourite Character's List!"
        }
    }

    componentDidMount() {
        fetch(Properties.CHARACTER_API, { method: "GET" })
            .then(response => response.json())
            .then(responseJSON => {
                console.log(responseJSON)
                this.setState({
                    characterList: responseJSON,
                    maxPage: (responseJSON.length + this.state.countPerPage - 1) / this.state.countPerPage
                }, () => this.updatedCharacterListFiltered())
            })
    }

    previousPage = () => {
        if (this.state.pageNumber > 1)
            this.setState({
                pageNumber: this.state.pageNumber - 1
            })
    }

    nextPage = () => {
        if (this.state.pageNumber + 1 <= this.state.maxPage && this.isNextPageAvailable())
            this.setState({
                pageNumber: this.state.pageNumber + 1
            })
    }

    isNextPageAvailable = () => {
        const { filteredCharacterList, countPerPage } = this.state;
        if (this.state.pageNumber + 1 <= (filteredCharacterList.length + countPerPage - 1) / countPerPage)
            return true
        return false;
    }

    updateSearchKey = (event) => {
        const { value, name } = event.target
        this.setState({
            [name]: value,
            pageNumber: 1,
        }, () => this.updatedCharacterListFiltered())
    }

    updatedCharacterListFiltered = () => {
        const { characterList, searchTerm } = this.state;

        // NOW YOU CAN SEARCH FOR name, nickname, potrayed, occupation, status, birthday
        const filteredCharacterList = characterList
            .filter(character => {
                return (
                    character.name.toLowerCase()
                        .includes(searchTerm.toLowerCase())
                    || character.nickname.toLowerCase()
                        .includes(searchTerm.toLowerCase())
                    || character.portrayed.toLowerCase()
                        .includes(searchTerm.toLowerCase())
                    || character.occupation.toString().toLowerCase()
                        .includes(searchTerm.toLowerCase())
                    || character.status.toLowerCase()
                        .includes(searchTerm.toLowerCase())
                    || character.birthday.toLowerCase()
                        .includes(searchTerm.toLowerCase())
                )
            })

        console.log(filteredCharacterList)

        if (filteredCharacterList.length <= 0)
            this.setState({
                message: "Oops! No Characters to Display!"
            })
        this.setState({ filteredCharacterList })
    }

    render() {
        const { filteredCharacterList, searchTerm, pageNumber, countPerPage, message } = this.state;
        let occupations = "";

        console.log(this.props, filteredCharacterList);

        return (
            <div className="home-page-container">
                <div className="characters-list">
                    {
                        filteredCharacterList.length > 0
                            ? filteredCharacterList
                                .slice((pageNumber * countPerPage) - countPerPage, pageNumber * countPerPage)
                                .map(character => {
                                    console.log(character)
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
                            : <div className="search-error">{message}</div>
                    }
                </div>
                <div className="pagination">
                    <div className="button previous-page" onClick={() => this.previousPage()}>&laquo; Previous({pageNumber - 1})</div>
                    <input type="search" name="searchTerm" id="searchTerm" className="button search-button" placeholder="Search..."
                        value={searchTerm} onChange={(event) => this.updateSearchKey(event)} />
                    <div className="button next-page" onClick={() => this.nextPage()}>Next &raquo;({parseInt((filteredCharacterList.length + countPerPage - 1) / countPerPage) - pageNumber})</div>
                </div>
            </div>
        )
    }
}

export default HomePage;