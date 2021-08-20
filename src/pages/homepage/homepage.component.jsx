import React from 'react';

import { Properties } from '../../global.properties';

import shortid from 'shortid';

import './homepage.styles.scss';
import CustomButton from '../../components/custom-button/custom-button.component';

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
            message: "Please Hold on! Getting You The Favourite Character's List!",
            searchFields: ["name", "nickname", "portrayed", "occupation", "status", "birthday", "category"]
        }
    }

    componentDidMount() {
        fetch(Properties.CHARACTER_API, { method: "GET" })
            .then(response => response.json())
            .then(responseJSON => {
                console.log(responseJSON)
                this.setState({
                    characterList: responseJSON,
                    maxPage: this.upcomingPageCount(responseJSON)
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
        if (this.state.pageNumber + 1 <= this.upcomingPageCount(this.state.filteredCharacterList))
            return true
        return false;
    }

    upcomingPageCount = (list) => {
        const { countPerPage } = this.state
        return (list.length + countPerPage - 1) / countPerPage;
    }

    updateSearchKey = (event) => {
        const { value, name } = event.target
        this.setState({
            [name]: value,
            pageNumber: 1,
        }, () => this.updatedCharacterListFiltered())
    }

    updatedCharacterListFiltered = () => {
        let { characterList, searchTerm, searchFields } = this.state;
        searchTerm = searchTerm.toLowerCase()

        // NOW YOU CAN SEARCH FOR name, nickname, potrayed, occupation, status, birthday
        const filteredCharacterList = characterList
            .filter(character => {
                for (let index = 0; index < searchFields.length; index++) {
                    const element = searchFields[index];
                    if (character[element].toString().toLowerCase().includes(searchTerm)) {
                        return character;
                    }
                }
                return null
            })
            .filter(Boolean)

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

        // console.log(this.props, filteredCharacterList);

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
                    <CustomButton className="button previous-page"
                        onClick={() => this.previousPage()}>&laquo; Previous({pageNumber - 1})</CustomButton>
                    <input type="search" name="searchTerm" id="searchTerm" className="button search-button" placeholder="Search..."
                        value={searchTerm} onChange={(event) => this.updateSearchKey(event)} />
                    <CustomButton className="button next-page"
                        onClick={() => this.nextPage()}>Next &raquo;({Math.max(0, parseInt(this.upcomingPageCount(filteredCharacterList) - pageNumber))})</CustomButton>
                </div>
            </div>
        )
    }
}

export default HomePage;