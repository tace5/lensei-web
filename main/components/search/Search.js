import {Form, InputGroup} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSearch} from "@fortawesome/free-solid-svg-icons";

import * as styles from "./Search.module.scss";

const Search = ({ placeholder, onSearch, onChange, value }) => {
    return (
        <Form onSubmit={onSearch}>
            <InputGroup className={styles["search-bar-ig"]}>
                <InputGroup.Prepend className="d-flex">
                    <InputGroup.Text className={styles["ig-text"]}><FontAwesomeIcon icon={faSearch} /></InputGroup.Text>
                </InputGroup.Prepend>
                <Form.Control type="text" name="searchValue" placeholder={placeholder} className={styles["search-bar"]} onChange={onChange} value={value} size="lg" />
            </InputGroup>
        </Form>
    )
}

export default Search;