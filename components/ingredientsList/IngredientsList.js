import React, { useState } from "react";
import AsyncSelect from 'react-select/async'
import IngredientsListItem from "./IngredientsListItem.js";
import { Accordion, Row, Button } from "react-bootstrap";

import styles from "./IngredientsList.module.css";

export default function IngredientsList({ loadIngredientsOptions }) {
    const [selectedOption, setSelectedOption] = useState(null);
    const [ingredientsList, setIngredientsList] = useState([]);

    const handleSelect = ingredientOption => {
        setIngredientsList([
            ...ingredientsList,
            ingredientOption.value
        ])
        setSelectedOption(null);
    }

    const filterOption = option => {
        return !ingredientsList.find(ingredient => ingredient.id === option.value.id)
    }

    return (
        <div>
            <div className={styles["ingredients-search-container"]}>
                <div className={styles["ingredients-search"]}>
                    <AsyncSelect
                        placeholder="Search..."
                        instanceId="ingredients-search"
                        value={selectedOption}
                        cacheOptions
                        loadOptions={(searchInput, cb) => loadIngredientsOptions(searchInput, cb, ingredientsList)}
                        filterOption={filterOption}
                        onChange={handleSelect}
                    />
                </div>
                <Button>New Ingredient</Button>
            </div>

            <Accordion>
                { ingredientsList.length > 0
                    ? ingredientsList.map(ingredient => <IngredientsListItem key={ingredient.id} ingredient={ingredient} />)
                    : "No ingredients added" }
            </Accordion>
        </div>
    )
}