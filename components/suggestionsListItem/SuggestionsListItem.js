import { Button, Card } from "react-bootstrap";
import styles from "./SuggestionsListItem.module.scss";
import React from "react";

export default function SuggestionsListItem({ onViewClick, suggestion }) {
    const daysSinceSuggestion = new Date().getDate() - new Date(suggestion.dateCreated).getDate();
    const daysSinceSuggestionString = daysSinceSuggestion === 0 ? "Today" : daysSinceSuggestion + " Days Ago";

    return (
        <Card className="mb-3">
            <Card.Header className={ styles["suggestions-list-item-header"] }>
                <div>
                    <b>{ suggestion.author.fullName }</b>: { suggestion.format + "-" + suggestion.code }
                </div>
                <div className="d-flex flex-row">
                    <div className="d-flex align-items-center mr-3">Suggested {daysSinceSuggestionString}</div>
                    <Button className="mr-2" onClick={() => onViewClick(suggestion.id)} size="sm">Open</Button>
                </div>
            </Card.Header>
        </Card>

    )
}