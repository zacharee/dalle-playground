import React, {SyntheticEvent} from "react";
import withStyles, {WithStyles} from "@material-ui/core/styles/withStyles";
import {createStyles, TextField} from "@material-ui/core";

const styles = createStyles({
    inputPrompt: {
        marginTop: '20px',
    },
})

interface Props extends WithStyles<typeof styles> {
    enterPressedCallback: (str: string) => void,
    disabled: boolean,
    promptText: string,
    setPromptText: (str: string) => void,
}

const TextPromptInput = ({ classes, enterPressedCallback, disabled, promptText, setPromptText }: Props) => {
    function handleTextPromptKeyPressed(event: React.KeyboardEvent) {
        if (event.key === 'Enter') {
            enterPressedCallback(promptText)
        }
    }

    function onTextChanged(event: React.ChangeEvent) {
        setPromptText((event.target as HTMLTextAreaElement).value)
    }

    return (
        <TextField className={classes.inputPrompt} id="prompt-input" label="Text prompt"
            helperText="hit Enter to generate images"
            placeholder="e.g. an apple on a table" value={promptText}
            onChange={onTextChanged} fullWidth
            onKeyPress={handleTextPromptKeyPressed} disabled={disabled} />
    )
}

export default withStyles(styles)(TextPromptInput);
